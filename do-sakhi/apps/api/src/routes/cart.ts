import { Router } from 'express';
import { query } from '../db';
import { z } from 'zod';

const router = Router();

// Zod schemas
const addToCartSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid(),
  quantity: z.number().int().min(1).default(1),
});

const tailoringSchema = z.object({
  measurements: z.record(z.string(), z.number().min(10).max(200)),
  instructions: z.string().optional(),
});

// POST /api/v1/cart
router.post('/', async (req, res) => {
  try {
    const { guestId } = req.body;
    let finalGuestId = guestId;

    if (!finalGuestId) {
      // Create guest session
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const guestResult = await query(
        `INSERT INTO guest_sessions (session_token, expires_at) VALUES ($1, NOW() + INTERVAL '30 days') RETURNING id`,
        [token]
      );
      finalGuestId = guestResult.rows[0].id;
    }

    // Check if cart exists for guest
    const existingCart = await query(
      `SELECT * FROM carts WHERE guest_session_id = $1 AND status = 'active'`,
      [finalGuestId]
    );

    if (existingCart.rows.length > 0) {
      return res.json({ data: existingCart.rows[0] });
    }

    const newCart = await query(
      `INSERT INTO carts (guest_session_id) VALUES ($1) RETURNING *`,
      [finalGuestId]
    );

    res.status(201).json({ data: newCart.rows[0] });

  } catch (error) {
    console.error('Error creating cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/v1/cart/:cartId/items
router.post('/:cartId/items', async (req, res) => {
  try {
    const { cartId } = req.params;
    const validatedData = addToCartSchema.parse(req.body);

    // Verify cart exists
    const cartCheck = await query(`SELECT id FROM carts WHERE id = $1 AND status = 'active'`, [cartId]);
    if (cartCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Cart not found or not active' });
    }

    // Fetch product and variant details
    const productResult = await query(`SELECT id FROM products WHERE id = $1 AND status = 'active'`, [validatedData.productId]);
    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const variantResult = await query(`SELECT stock_quantity, reserved_quantity, sku, price_inr FROM product_variants WHERE id = $1 AND product_id = $2 AND is_active = true`, [validatedData.variantId, validatedData.productId]);
    if (variantResult.rows.length === 0) {
      return res.status(404).json({ error: 'Variant not found' });
    }

    const variant = variantResult.rows[0];
    const availableStock = variant.stock_quantity - variant.reserved_quantity;

    if (availableStock < validatedData.quantity) {
      return res.status(400).json({ error: 'Not enough stock available' });
    }

    const price = variant.price_inr;

    // Check if item already in cart
    const existingItem = await query(
      `SELECT id, quantity FROM cart_items WHERE cart_id = $1 AND variant_id = $2`,
      [cartId, validatedData.variantId]
    );

    let cartItem;

    if (existingItem.rows.length > 0) {
      const newQuantity = existingItem.rows[0].quantity + validatedData.quantity;
      if (availableStock < newQuantity) {
        return res.status(400).json({ error: 'Not enough stock available for combined quantity' });
      }
      
      const updateResult = await query(
        `UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING *`,
        [newQuantity, existingItem.rows[0].id]
      );
      cartItem = updateResult.rows[0];
    } else {
      const insertResult = await query(
        `INSERT INTO cart_items (cart_id, product_id, variant_id, quantity, unit_price_inr) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [cartId, validatedData.productId, validatedData.variantId, validatedData.quantity, price]
      );
      cartItem = insertResult.rows[0];
    }

    res.status(201).json({ data: cartItem });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.issues });
    }
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/v1/cart/:cartId/items/:cartItemId/tailoring
router.post('/:cartId/items/:cartItemId/tailoring', async (req, res) => {
  try {
    const { cartId, cartItemId } = req.params;
    const validatedData = tailoringSchema.parse(req.body);

    // Verify cart and item exist
    const itemCheck = await query(
      `SELECT id FROM cart_items WHERE id = $1 AND cart_id = $2`,
      [cartItemId, cartId]
    );

    if (itemCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    const updateResult = await query(
      `UPDATE cart_items 
       SET tailoring_requested = true, tailoring_payload = $1 
       WHERE id = $2 RETURNING *`,
      [JSON.stringify(validatedData), cartItemId]
    );

    res.json({ data: updateResult.rows[0] });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed. Measurements must be between 10 and 200.', details: error.issues });
    }
    console.error('Error adding tailoring:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
