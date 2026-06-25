import { Hono } from 'hono';
import { query } from '../db';
import { z } from 'zod';

import { Env } from '../index';
const router = new Hono<{ Bindings: Env }>();



// ─── Validation Schemas ────────────────────────────────────────────────────────

const VariantSchema = z.object({
  sku: z.string().min(1),
  colorName: z.string().min(1),
  colorHex: z.string().optional(),
  sizeLabel: z.string().min(1),
  sizeNumeric: z.string().optional(),
  priceInr: z.number().positive(),
  compareAtPriceInr: z.number().positive().optional(),
  costPriceInr: z.number().positive().optional(),
  stockQuantity: z.number().int().min(0),
  lowStockThreshold: z.number().int().min(0).default(2),
  weightGrams: z.number().int().optional(),
});

const MediaSchema = z.object({
  mediaType: z.enum(['image', 'video']),
  mediaRole: z.string().min(1), // 'front', 'back', 'side', 'lifestyle', etc.
  url: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  altText: z.string().optional(),
  width: z.number().int().optional(),
  height: z.number().int().optional(),
  position: z.number().int().default(0),
  isPrimary: z.boolean().default(false),
});

const CreateProductSchema = z.object({
  // Core identity
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  ribbon: z.string().optional(), // e.g. "READY TO SHIP", "LIMITED PIECE", "CUSTOM FIT AVAILABLE"

  // Classification
  productType: z.string().min(1),
  status: z.enum(['draft', 'active', 'archived']).default('draft'),
  fulfillmentType: z.enum(['ready_to_ship', 'made_to_order', 'custom_tailoring']).default('ready_to_ship'),
  isReadyToShip: z.boolean().default(true),
  isMadeToOrder: z.boolean().default(false),
  customTailoringAvailable: z.boolean().default(false),

  // Fabric & Material
  fabricType: z.string().optional(),
  fabricComposition: z.string().optional(),
  fabricFeel: z.string().optional(),
  careInstructions: z.string().optional(),
  fitNote: z.string().optional(),

  // Silhouette details
  silhouette: z.string().optional(),
  neckline: z.string().optional(),
  sleeveType: z.string().optional(),
  kurtiLength: z.string().optional(),
  bottomType: z.string().optional(),

  // Features
  dupatteIncluded: z.boolean().default(false),
  pocketAvailable: z.boolean().default(false),
  embroideryDetail: z.string().optional(),
  printDetail: z.string().optional(),

  // Fulfillment timing
  leadTimeMinDays: z.number().int().default(2),
  leadTimeMaxDays: z.number().int().default(7),

  // SEO
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),

  // Collections to link (array of collection slugs)
  collectionSlugs: z.array(z.string()).optional().default([]),

  // Tags
  tags: z.array(z.object({
    tagType: z.string(),
    tagValue: z.string(),
  })).optional().default([]),

  // Variants (sizes × colours × pricing)
  variants: z.array(VariantSchema).min(1),

  // Media
  media: z.array(MediaSchema).optional().default([]),
});

// ─── POST /api/v1/admin/upload ───────────────────────────────────────────────
// Upload a media file and return its URL

router.post('/upload', async (c) => {
  try {
    const body = await c.req.parseBody();
    const file = body['file'] as File;
    
    if (!file) {
      return c.json({ error: 'No file uploaded' }, 400);
    }

    const fileExtension = file.name ? file.name.substring(file.name.lastIndexOf('.')) : '';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `products/${uniqueSuffix}${fileExtension}`;

    await c.env.BUCKET.put(filename, await file.arrayBuffer(), {
      httpMetadata: {
        contentType: file.type,
      },
    });

    const publicUrl = c.env.R2_PUBLIC_URL || 'https://cd5a55aca305cdfa04cb1c76d4837a74.r2.cloudflarestorage.com/do-sakhi';
    const url = `${publicUrl}/${filename}`;

    return c.json({ url });
  } catch (error) {
    console.error('R2 upload error:', error);
    return c.json({ error: 'Failed to upload image' }, 500);
  }
});

// ─── POST /api/v1/admin/products ─────────────────────────────────────────────
// Creates a product with all variants, media, tags, and collection mappings
// in a single database transaction.

router.post('/products', async (c) => {
  const parsed = CreateProductSchema.safeParse((await c.req.json()));
  if (!parsed.success) {
    return c.json({ error: 'Validation failed', details: parsed.error.flatten() });
  }

  const d = parsed.data;

  // Build the ribbon/badge as a product tag
  const allTags = [...(d.tags || [])];
  if (d.ribbon) {
    allTags.push({ tagType: 'ribbon', tagValue: d.ribbon });
  }

  try {
    await query('BEGIN');

    // 1. Insert core product row
    const productResult = await query(
      `INSERT INTO products (
        title, slug, short_description, description,
        product_type, status, fulfillment_type,
        is_ready_to_ship, is_made_to_order, custom_tailoring_available,
        fabric_type, fabric_composition, fabric_feel,
        care_instructions, fit_note, silhouette,
        neckline, sleeve_type, kurti_length, bottom_type,
        dupatta_included, pocket_available,
        embroidery_detail, print_detail,
        lead_time_min_days, lead_time_max_days,
        seo_title, seo_description
      ) VALUES (
        $1,$2,$3,$4,
        $5,$6,$7,
        $8,$9,$10,
        $11,$12,$13,
        $14,$15,$16,
        $17,$18,$19,$20,
        $21,$22,
        $23,$24,
        $25,$26,
        $27,$28
      ) RETURNING id`,
      [
        d.title, d.slug, d.shortDescription ?? null, d.description ?? null,
        d.productType, d.status, d.fulfillmentType,
        d.isReadyToShip, d.isMadeToOrder, d.customTailoringAvailable,
        d.fabricType ?? null, d.fabricComposition ?? null, d.fabricFeel ?? null,
        d.careInstructions ?? null, d.fitNote ?? null, d.silhouette ?? null,
        d.neckline ?? null, d.sleeveType ?? null, d.kurtiLength ?? null, d.bottomType ?? null,
        d.dupatteIncluded, d.pocketAvailable,
        d.embroideryDetail ?? null, d.printDetail ?? null,
        d.leadTimeMinDays, d.leadTimeMaxDays,
        d.seoTitle ?? null, d.seoDescription ?? null,
      ]
    );

    const productId = productResult.rows[0].id;

    // 2. Insert variants
    for (const v of d.variants) {
      await query(
        `INSERT INTO product_variants (
          product_id, sku, color_name, color_hex,
          size_label, size_numeric,
          price_inr, compare_at_price_inr, cost_price_inr,
          stock_quantity, low_stock_threshold, weight_grams
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
        [
          productId, v.sku, v.colorName, v.colorHex ?? null,
          v.sizeLabel, v.sizeNumeric ?? null,
          v.priceInr, v.compareAtPriceInr ?? null, v.costPriceInr ?? null,
          v.stockQuantity, v.lowStockThreshold, v.weightGrams ?? null,
        ]
      );
    }

    // 3. Insert media
    for (const m of d.media) {
      await query(
        `INSERT INTO product_media (
          product_id, media_type, media_role,
          url, thumbnail_url, alt_text,
          width, height, position, is_primary
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [
          productId, m.mediaType, m.mediaRole,
          m.url, m.thumbnailUrl ?? null, m.altText ?? null,
          m.width ?? null, m.height ?? null, m.position, m.isPrimary,
        ]
      );
    }

    // 4. Insert tags (including ribbon)
    for (const t of allTags) {
      await query(
        `INSERT INTO product_tags (product_id, tag_type, tag_value) VALUES ($1,$2,$3)`,
        [productId, t.tagType, t.tagValue]
      );
    }

    // 5. Map to collections
    if (d.collectionSlugs && d.collectionSlugs.length > 0) {
      for (const slug of d.collectionSlugs) {
        await query(
          `INSERT INTO product_collection_mapping (product_id, collection_id)
           SELECT $1, id FROM collections WHERE slug = $2
           ON CONFLICT DO NOTHING`,
          [productId, slug]
        );
      }
    }

    await query('COMMIT');

    return c.json({
      message: 'Product created successfully',
      productId,
      slug: d.slug,
    }, 201);

  } catch (err: any) {
    await query('ROLLBACK');
    console.error('Admin create product error:', err);

    // Surface duplicate slug/SKU errors clearly
    if (err.code === '23505') {
      const field = err.constraint?.includes('slug') ? 'slug' : 'SKU';
      return c.json({ error: `Duplicate ${field} — please use a unique value.` }, 409);
    }
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ─── GET /api/v1/admin/products ──────────────────────────────────────────────
// List all products (all statuses) for the admin dashboard

router.get('/products', async (c) => {
  try {
    const result = await query(`
      SELECT
        p.id, p.slug, p.title, p.status, p.fulfillment_type,
        p.created_at,
        COUNT(DISTINCT pv.id) as variant_count,
        COALESCE(SUM(pv.stock_quantity), 0) as total_stock,
        MIN(pv.price_inr) as min_price,
        MAX(pv.price_inr) as max_price,
        (SELECT pm.url FROM product_media pm WHERE pm.product_id = p.id AND pm.media_role = 'front' LIMIT 1) as thumbnail
      FROM products p
      LEFT JOIN product_variants pv ON pv.product_id = p.id AND pv.is_active = true
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);
    return c.json({ data: result.rows });
  } catch (err) {
    console.error('Admin list products error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ─── GET /api/v1/admin/collections ───────────────────────────────────────────
// Returns all collections for the collection selector in the form

router.get('/collections', async (c) => {
  try {
    const result = await query(`SELECT id, slug, title FROM collections WHERE is_active = true ORDER BY sort_order ASC`);
    return c.json({ data: result.rows });
  } catch (err) {
    console.error('Admin list collections error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ─── DELETE /api/v1/admin/products/:id ───────────────────────────────────────

router.delete('/products/:id', async (c) => {
  const { id } = c.req.param();
  try {
    await query(`DELETE FROM products WHERE id = $1`, [id]);
    return c.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Admin delete product error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ─── PATCH /api/v1/admin/products/:id/status ─────────────────────────────────

router.patch('/products/:id/status', async (c) => {
  const { id } = c.req.param();
  const { status } = (await c.req.json());
  if (!['draft', 'active', 'archived'].includes(status)) {
    return c.json({ error: 'Invalid status value' }, 400);
  }
  try {
    await query(`UPDATE products SET status = $1, updated_at = NOW() WHERE id = $2`, [status, id]);
    return c.json({ message: 'Status updated', status });
  } catch (err) {
    console.error('Admin update status error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default router;
