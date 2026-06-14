import { Router } from 'express';
import { pool } from '../db';
import { z } from 'zod';
import crypto from 'crypto';

const router = Router();

const checkoutSchema = z.object({
  cartId: z.string().uuid(),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(10),
  shippingAddress: z.object({
    addressLine1: z.string().min(1),
    addressLine2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    pincode: z.string().min(1),
    country: z.string().default('India')
  })
});

// POST /api/v1/checkout
router.post('/', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const validatedData = checkoutSchema.parse(req.body);
    const { cartId, customerEmail, customerPhone, shippingAddress } = validatedData;

    await client.query('BEGIN');

    // 1. Get Cart & Items
    const cartItemsQuery = await client.query(
      `SELECT ci.*, 
              pv.stock_quantity, pv.reserved_quantity, pv.sku, pv.size_label as variant_title, 
              p.title as product_title, p.fulfillment_type, 
              ci.tailoring_requested, ci.tailoring_payload
       FROM cart_items ci
       JOIN product_variants pv ON ci.variant_id = pv.id
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = $1`,
      [cartId]
    );

    const cartItems = cartItemsQuery.rows;

    if (cartItems.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // 2. Lock variants & check stock
    const variantIds = cartItems.map(item => item.variant_id);
    
    // Lock variants for update to prevent concurrent checkout conflicts
    const lockedVariantsResult = await client.query(
      `SELECT id, stock_quantity, reserved_quantity 
       FROM product_variants 
       WHERE id = ANY($1) 
       FOR UPDATE`,
      [variantIds]
    );

    const lockedVariants = new Map(lockedVariantsResult.rows.map(v => [v.id, v]));

    let totalAmount = 0;

    for (const item of cartItems) {
      const variant = lockedVariants.get(item.variant_id);
      if (!variant) {
        throw new Error(`Variant ${item.variant_id} not found`);
      }

      const availableStock = variant.stock_quantity - variant.reserved_quantity;
      if (availableStock < item.quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({ 
          error: 'Insufficient stock for one or more items',
          variantId: item.variant_id
        });
      }

      totalAmount += (Number(item.unit_price_inr) * item.quantity);
    }

    const orderNumber = 'DS' + crypto.randomBytes(3).toString('hex').toUpperCase();
    const stockLockExpiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    // 3. Create Order with correct status and lock expiration
    const orderResult = await client.query(
      `INSERT INTO orders 
        (order_number, guest_session_id, customer_email, customer_phone, subtotal_inr, total_inr, status, payment_status, shipping_address, stock_lock_expires_at)
       VALUES 
        ($1, (SELECT guest_session_id FROM carts WHERE id = $2 LIMIT 1), $3, $4, $5, $6, 'payment_initiated', 'pending', $7, $8)
       RETURNING id, order_number, stock_lock_expires_at`,
      [orderNumber, cartId, customerEmail, customerPhone, totalAmount, totalAmount, JSON.stringify(shippingAddress), stockLockExpiresAt]
    );
    
    const order = orderResult.rows[0];

    // 4. Create Order Items & Tailoring Details, and Reserve Stock
    for (const item of cartItems) {
      // Create Order Item
      const orderItemResult = await client.query(
        `INSERT INTO order_items 
          (order_id, product_id, variant_id, product_title, variant_title, sku, quantity, unit_price_inr, line_total_inr, fulfillment_type, tailoring_status)
         VALUES 
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING id`,
        [
          order.id, 
          item.product_id, 
          item.variant_id, 
          item.product_title, 
          item.variant_title, 
          item.sku, 
          item.quantity, 
          item.unit_price_inr, 
          Number(item.unit_price_inr) * item.quantity, 
          item.fulfillment_type, 
          item.tailoring_requested ? 'pending_measurements' : 'not_required'
        ]
      );

      // Create Custom Tailoring Details if requested
      if (item.tailoring_requested && item.tailoring_payload) {
        const payload = item.tailoring_payload.measurements || {};
        await client.query(
          `INSERT INTO custom_tailoring_details 
            (order_item_id, tailoring_type, bust_inches, waist_inches, hip_inches, custom_request)
           VALUES 
            ($1, 'standard', $2, $3, $4, $5)`,
          [
            orderItemResult.rows[0].id, 
            payload.bustInches || null, 
            payload.waistInches || null, 
            payload.hipInches || null, 
            item.tailoring_payload.instructions || ''
          ]
        );
      }

      // Reserve stock
      await client.query(
        `UPDATE product_variants 
         SET reserved_quantity = reserved_quantity + $1, updated_at = NOW() 
         WHERE id = $2`,
        [item.quantity, item.variant_id]
      );
    }

    // 5. Deactivate Cart
    await client.query(
      `UPDATE carts SET status = 'completed', updated_at = NOW() WHERE id = $1`,
      [cartId]
    );

    await client.query('COMMIT');

    // 6. Return response matching blueprint
    res.json({
      orderId: order.id,
      orderNumber: order.order_number,
      status: 'payment_initiated',
      stockLockExpiresAt: order.stock_lock_expires_at,
      payment: {
        gateway: 'razorpay',
        gatewayOrderId: `order_mock_${order.order_number}`,
        amount: totalAmount * 100,
        currency: 'INR',
        keyId: 'rzp_test_mock_key'
      }
    });

  } catch (error: any) {
    await client.query('ROLLBACK');
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.issues });
    }
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Internal server error during checkout' });
  } finally {
    client.release();
  }
});

export default router;
