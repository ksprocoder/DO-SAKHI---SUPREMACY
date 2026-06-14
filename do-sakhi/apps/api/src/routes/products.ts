import { Router } from 'express';
import { query } from '../db';
import { z } from 'zod';

const router = Router();

// GET /api/v1/products
router.get('/', async (req, res) => {
  try {
    const {
      collection,
      size,
      fabric,
      occasion,
      silhouette,
      availability,
      minPrice,
      maxPrice,
      page = '1',
      limit = '10'
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const offset = (pageNum - 1) * limitNum;

    let baseQuery = `
      SELECT 
        p.id, 
        p.slug,
        p.title,
        (
          SELECT MIN(pv.price_inr) 
          FROM product_variants pv 
          WHERE pv.product_id = p.id AND pv.is_active = true
        ) as price,
        p.fabric_composition as fabric,
        p.silhouette,
        p.product_type,
        p.custom_tailoring_available,
        p.is_ready_to_ship,
        (
          SELECT pv.color_name 
          FROM product_variants pv 
          WHERE pv.product_id = p.id AND pv.is_active = true 
          LIMIT 1
        ) as colour,
        (
          SELECT array_agg(DISTINCT pv.size_label) 
          FROM product_variants pv 
          WHERE pv.product_id = p.id AND pv.is_active = true
        ) as available_sizes,
        (
          SELECT pm.url 
          FROM product_media pm 
          WHERE pm.product_id = p.id AND pm.media_role = 'front' 
          LIMIT 1
        ) as image,
        (
          SELECT pm.url 
          FROM product_media pm 
          WHERE pm.product_id = p.id AND pm.media_role = 'back' 
          LIMIT 1
        ) as hover_image
      FROM products p
      WHERE p.status = 'active'
    `;

    const queryParams: any[] = [];
    let paramIndex = 1;

    if (collection) {
      baseQuery += ` AND p.id IN (SELECT product_id FROM product_collection_mapping WHERE collection_id = (SELECT id FROM collections WHERE slug = $${paramIndex++} LIMIT 1))`;
      queryParams.push(collection);
    }
    if (fabric) {
      baseQuery += ` AND p.fabric_composition ILIKE $${paramIndex++}`;
      queryParams.push(`%${fabric}%`);
    }
    if (occasion) {
      baseQuery += ` AND EXISTS (SELECT 1 FROM product_tags pt WHERE pt.product_id = p.id AND pt.tag_type = 'occasion' AND pt.tag_value ILIKE $${paramIndex++})`;
      queryParams.push(`%${occasion}%`);
    }
    if (silhouette) {
      baseQuery += ` AND p.silhouette ILIKE $${paramIndex++}`;
      queryParams.push(`%${silhouette}%`);
    }
    if (minPrice) {
      baseQuery += ` AND EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id AND pv.price_inr >= $${paramIndex++})`;
      queryParams.push(minPrice);
    }
    if (maxPrice) {
      baseQuery += ` AND EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id AND pv.price_inr <= $${paramIndex++})`;
      queryParams.push(maxPrice);
    }
    if (size) {
      baseQuery += ` AND EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id AND pv.size_label = $${paramIndex++})`;
      queryParams.push(size);
    }
    
    // Total count query
    const countQuery = `SELECT COUNT(*) FROM (${baseQuery}) as count_table`;
    const countResult = await query(countQuery, queryParams);
    const totalItems = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalItems / limitNum);

    // Add pagination
    baseQuery += ` ORDER BY p.created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    queryParams.push(limitNum, offset);

    const { rows } = await query(baseQuery, queryParams);

    res.json({
      data: rows,
      pagination: {
        totalItems,
        totalPages,
        currentPage: pageNum,
        limit: limitNum
      },
      availableFilters: {
        // mock filters for now
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        fabrics: ['Silk', 'Cotton', 'Linen'],
        occasions: ['Wedding', 'Festive', 'Casual']
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/products/:slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const productQuery = `
      SELECT 
        p.*,
        c.title as collection_title,
        c.slug as collection_slug
      FROM products p
      LEFT JOIN product_collection_mapping pcm ON p.id = pcm.product_id
      LEFT JOIN collections c ON pcm.collection_id = c.id
      WHERE p.slug = $1 AND p.status = 'active'
      LIMIT 1
    `;
    const productResult = await query(productQuery, [slug]);

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = productResult.rows[0];

    const variantsQuery = `
      SELECT * FROM product_variants 
      WHERE product_id = $1 AND is_active = true
      ORDER BY size_label ASC
    `;
    const variantsResult = await query(variantsQuery, [product.id]);

    const mediaQuery = `
      SELECT * FROM product_media 
      WHERE product_id = $1
      ORDER BY position ASC
    `;
    const mediaResult = await query(mediaQuery, [product.id]);

    const stockAvailable = variantsResult.rows.reduce((sum, variant) => {
      return sum + (variant.stock_quantity - variant.reserved_quantity);
    }, 0);

    res.json({
      data: {
        ...product,
        variants: variantsResult.rows,
        media: mediaResult.rows,
        stockAvailable
      }
    });

  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
