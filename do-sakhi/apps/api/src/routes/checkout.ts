// @ts-nocheck
import { Hono } from 'hono';
import { query } from '../db';
import { z } from 'zod';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { paymentsConfig } from '../config/payments';

const router = new Hono();

const itemSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid(),
  quantity: z.number().int().positive(),
  tailoringProfile: z.object({
    bustInches: z.number().optional().nullable(),
    waistInches: z.number().optional().nullable(),
    hipInches: z.number().optional().nullable(),
    shoulderInches: z.number().optional().nullable(),
    heightInches: z.number().optional().nullable(),
    customRequest: z.string().optional().nullable(),
  }).optional().nullable()
});

const checkoutSchema = z.object({
  clientRequestId: z.string().min(1).optional(),
  contact: z.object({
    fullName: z.string().min(1),
    mobile: z.string().min(10),
    email: z.string().email().optional().or(z.literal('')),
  }),
  address: z.object({
    addressLine1: z.string().min(1),
    addressLine2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    pin: z.string().min(6),
    country: z.string().default('India'),
    landmark: z.string().optional(),
    deliveryNotes: z.string().max(300).optional(),
  }),
  items: z.array(itemSchema).min(1, "Cart cannot be empty")
});

// Init Razorpay safely
let razorpay: Razorpay | null = null;
if (paymentsConfig.enabled && paymentsConfig.keyId && paymentsConfig.keySecret) {
  razorpay = new Razorpay({
    key_id: paymentsConfig.keyId,
    key_secret: paymentsConfig.keySecret,
  });
}

// POST /api/v1/checkout/create-payment-order
router.post('/create-payment-order', async (c: any) => {
  if (!paymentsConfig.enabled) {
    return c.json({
      success: false,
      error: { code: 'PAYMENTS_DISABLED', message: 'Payments are not enabled in this environment.' }
    }, 400);
  }
  
  if (paymentsConfig.enabled && !razorpay) {
    return c.json({
      success: false,
      error: { code: 'PAYMENTS_NOT_CONFIGURED', message: 'Razorpay test keys are not configured.' }
    }, 500);
  }

  const client = await pool.connect();
  let createdOrderId: string | null = null;
  const variantIdsToRelease: {id: string, qty: number}[] = [];

  try {
    const parseResult = checkoutSchema.safeParse((await c.req.json()));
    if (!parseResult.success) {
      return c.json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid checkout details.', details: parseResult.error.issues }
      }, 400);
    }

    const { contact, address, items, clientRequestId } = parseResult.data;

    await client.query('BEGIN');

    // 1. Lock variants & check stock
    const variantIds = items.map(item => item.variantId);
    
    // We also need product details to save in order_items
    const lockedVariantsResult = await client.query(
      `SELECT pv.id, pv.stock_quantity, pv.reserved_quantity, pv.price_inr, pv.sku, pv.size_label as variant_title, 
              p.id as product_id, p.title as product_title, p.fulfillment_type
       FROM product_variants pv
       JOIN products p ON pv.product_id = p.id
       WHERE pv.id = ANY($1) 
       FOR UPDATE`,
      [variantIds]
    );

    const lockedVariants = new Map(lockedVariantsResult.rows.map((v: any) => [v.id, v]));

    let totalAmountInr = 0;

    for (const item of items) {
      const variant = lockedVariants.get(item.variantId);
      if (!variant) {
        await client.query('ROLLBACK');
        return c.json({ 
          success: false,
          error: { code: 'VARIANT_NOT_FOUND', message: `Variant ${item.variantId} not found.` }
        }, 400);
      }

      if (variant.product_id !== item.productId) {
         await client.query('ROLLBACK');
         return c.json({
           success: false,
           error: { code: 'PRODUCT_MISMATCH', message: `Variant ${item.variantId} does not belong to product ${item.productId}.` }
         }, 400);
      }

      const availableStock = variant.stock_quantity - variant.reserved_quantity;
      if (availableStock < item.quantity) {
        await client.query('ROLLBACK');
        return c.json({ 
          success: false,
          error: { code: 'STOCK_UNAVAILABLE', message: `Item ${variant.product_title} is no longer available in the selected size.` }
        }, 400);
      }

      totalAmountInr += (Number(variant.price_inr) * item.quantity);
    }

    const totalPaise = Math.round(totalAmountInr * 100);

    const orderNumber = 'DS' + crypto.randomBytes(3).toString('hex').toUpperCase();
    const stockLockExpiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    // 2. Create Order
    const orderResult = await client.query(
      `INSERT INTO orders 
        (order_number, customer_email, customer_phone, subtotal_inr, total_inr, status, payment_status, shipping_address, stock_lock_expires_at)
       VALUES 
        ($1, $2, $3, $4, $5, 'payment_initiated', 'pending', $6, $7)
       RETURNING id, order_number, stock_lock_expires_at`,
      [orderNumber, contact.email || null, contact.mobile, totalAmountInr, totalAmountInr, JSON.stringify(address), stockLockExpiresAt]
    );
    
    const order = orderResult.rows[0];
    createdOrderId = order.id;

    // 3. Create Order Items & Tailoring Details, and Reserve Stock
    for (const item of items) {
      const variant = lockedVariants.get(item.variantId)!;
      
      const tailoringRequested = !!item.tailoringProfile;
      
      const orderItemResult = await client.query(
        `INSERT INTO order_items 
          (order_id, product_id, variant_id, product_title, variant_title, sku, quantity, unit_price_inr, line_total_inr, fulfillment_type, tailoring_status)
         VALUES 
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING id`,
        [
          order.id, item.productId, item.variantId, variant.product_title, variant.variant_title, variant.sku, item.quantity, 
          variant.price_inr, Number(variant.price_inr) * item.quantity, variant.fulfillment_type, 
          tailoringRequested ? 'pending_measurements' : 'not_required'
        ]
      );

      if (tailoringRequested) {
        const payload = item.tailoringProfile!;
        await client.query(
          `INSERT INTO custom_tailoring_details 
            (order_item_id, tailoring_type, bust_inches, waist_inches, hip_inches, shoulder_inches, height_inches, custom_request)
           VALUES 
            ($1, 'standard', $2, $3, $4, $5, $6, $7)`,
          [
            orderItemResult.rows[0].id, 
            payload.bustInches || null, 
            payload.waistInches || null, 
            payload.hipInches || null, 
            payload.shoulderInches || null, 
            payload.heightInches || null, 
            payload.customRequest || null
          ]
        );
      }

      await client.query(
        `UPDATE product_variants SET reserved_quantity = reserved_quantity + $1, updated_at = NOW() WHERE id = $2`,
        [item.quantity, item.variantId]
      );
      variantIdsToRelease.push({ id: item.variantId, qty: item.quantity });
    }

    await client.query('COMMIT');

    // --- TRANSACTION COMMITTED ---
    
    // 4. Create Razorpay Order
    let rzpOrder: any;
    try {
      rzpOrder = await razorpay!.orders.create({
        amount: totalPaise,
        currency: 'INR',
        receipt: order.order_number,
        notes: {
          brand: 'Do Sakhi',
          orderId: order.id,
          orderNumber: order.order_number,
          clientRequestId: clientRequestId || '',
          environment: paymentsConfig.env
        }
      });
      
      // 5. Update internal order with Razorpay Order ID
      await pool.query(
        `UPDATE orders SET gateway_order_id = $1, payment_gateway = 'razorpay' WHERE id = $2`,
        [rzpOrder.id, order.id]
      );
      
    } catch (rzpError) {
      console.error('Razorpay order creation failed:', rzpError);
      
      // Revert order status to failed and release stock
      await pool.query(`UPDATE orders SET status = 'cancelled', payment_status = 'failed' WHERE id = $1`, [order.id]);
      for (const v of variantIdsToRelease) {
        await pool.query(`UPDATE product_variants SET reserved_quantity = reserved_quantity - $1 WHERE id = $2`, [v.qty, v.id]);
      }
      
      return c.json({
        success: false,
        error: { code: 'RAZORPAY_ORDER_FAILED', message: 'Failed to communicate with payment gateway.' }
      }, 502);
    }

    // 6. Return safe payload to frontend
    return c.json({
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.order_number,
        orderStatus: 'payment_initiated',
        paymentStatus: 'pending',
        amount: {
          subtotal: totalAmountInr,
          shipping: null,
          total: totalAmountInr,
          totalPaise: totalPaise,
          currency: 'INR'
        },
        razorpay: {
          keyId: paymentsConfig.keyId,
          orderId: rzpOrder.id,
          amount: totalPaise,
          currency: 'INR'
        },
        stockLockExpiresAt: order.stock_lock_expires_at
      }
    });

  } catch (error: any) {
    if (createdOrderId === null) {
      // Error happened before commit
      await client.query('ROLLBACK');
    }
    console.error('Checkout error:', error);
    return c.json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred.' } }, 500);
  } finally {
    client.release();
  }
});

const verifyPaymentSchema = z.object({
  orderId: z.string().uuid(),
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

// POST /api/v1/checkout/verify-payment
router.post('/verify-payment', async (c: any) => {
  if (!paymentsConfig.enabled) {
    return c.json({
      success: false,
      error: { code: 'PAYMENTS_DISABLED', message: 'Payments are not enabled in this environment.' }
    }, 400);
  }

  if (!paymentsConfig.keySecret) {
    return c.json({
      success: false,
      error: { code: 'PAYMENT_NOT_CONFIGURED', message: 'Razorpay secret key is not configured.' }
    }, 500);
  }

  // RAZORPAY_ENV = live block for this milestone
  if (paymentsConfig.env === 'live') {
    return c.json({
      success: false,
      error: { code: 'LIVE_MODE_BLOCKED', message: 'Live payment mode is not enabled for this milestone.' }
    }, 400);
  }

  const parseResult = verifyPaymentSchema.safeParse((await c.req.json()));
  if (!parseResult.success) {
    return c.json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Invalid payment verification details.' }
    }, 400);
  }

  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = parseResult.data;

  const client = await pool.connect();
  try {
    const orderResult = await client.query(
      `SELECT id, order_number, status, payment_status, gateway_order_id, gateway_payment_id 
       FROM orders WHERE id = $1`,
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      return c.json({
        success: false,
        error: { code: 'ORDER_NOT_FOUND', message: 'The order could not be found.' }
      }, 404);
    }

    const order = orderResult.rows[0];

    if (order.gateway_order_id !== razorpay_order_id) {
      return c.json({
        success: false,
        error: { code: 'ORDER_GATEWAY_MISMATCH', message: 'Order mismatch detected.' }
      }, 400);
    }

    // Idempotency check
    if (order.status === 'paid' && order.payment_status === 'captured') {
      if (order.gateway_payment_id === razorpay_payment_id) {
        return c.json({
          success: true,
          data: {
            orderId: order.id,
            orderNumber: order.order_number,
            orderStatus: order.status,
            paymentStatus: order.payment_status,
            verified: true,
            razorpay: {
              orderId: order.gateway_order_id,
              paymentId: order.gateway_payment_id
            },
            message: 'Payment verified securely.'
          }
        });
      } else {
         return c.json({
          success: false,
          error: { code: 'PAYMENT_ALREADY_VERIFIED_MISMATCH', message: 'Payment conflict detected.' }
        }, 409);
      }
    }

    if (order.status !== 'payment_initiated' && order.status !== 'pending') {
      return c.json({
        success: false,
        error: { code: 'ORDER_NOT_PAYABLE', message: 'Order is not in a payable state.' }
      }, 400);
    }

    // Signature verification
    const bodyToSign = `${order.gateway_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', paymentsConfig.keySecret)
      .update(bodyToSign)
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature, 'utf-8');
    const receivedBuffer = Buffer.from(razorpay_signature, 'utf-8');

    let isValid = false;
    if (expectedBuffer.length === receivedBuffer.length) {
      isValid = crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
    }

    if (!isValid) {
      return c.json({
        success: false,
        error: { code: 'PAYMENT_SIGNATURE_INVALID', message: 'We could not verify the payment securely. Please contact Do Sakhi before retrying. Your checkout details are still safe.' }
      }, 400);
    }

    // Verification successful. Update order inside transaction.
    await client.query('BEGIN');

    await client.query(
      `UPDATE orders 
       SET status = 'paid', payment_status = 'captured', gateway_payment_id = $1, updated_at = NOW() 
       WHERE id = $2`,
      [razorpay_payment_id, order.id]
    );

    // Insert into payment_events
    await client.query(
      `INSERT INTO payment_events 
        (gateway, event_id, event_type, order_id, gateway_order_id, gateway_payment_id, raw_payload, processed)
       VALUES 
        ('razorpay', $1, 'payment_verified', $2, $3, $4, $5, true)
       ON CONFLICT (gateway, event_id) DO NOTHING`,
      [
        razorpay_payment_id,
        order.id,
        order.gateway_order_id,
        razorpay_payment_id,
        JSON.stringify({ razorpay_order_id, razorpay_payment_id })
      ]
    );

    await client.query('COMMIT');

    return c.json({
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.order_number,
        orderStatus: 'paid',
        paymentStatus: 'captured',
        verified: true,
        razorpay: {
          orderId: order.gateway_order_id,
          paymentId: razorpay_payment_id
        },
        message: 'Payment verified securely. Your order has been received by Do Sakhi.'
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Verify payment error:', error);
    return c.json({
      success: false,
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred during verification.' }
    }, 500);
  } finally {
    client.release();
  }
});

// Map the old '/' endpoint for backwards compatibility during transition if needed
router.post('/', async (c: any) => {
  return c.json({ error: 'Endpoint deprecated. Use /create-payment-order' }, 400);
});

export default router;
