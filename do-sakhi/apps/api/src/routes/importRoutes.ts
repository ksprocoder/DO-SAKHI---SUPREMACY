// @ts-nocheck
import { Hono } from 'hono';
import * as xlsx from 'xlsx';
import { query } from '../db';
import { z } from 'zod';

const router = new Hono();
function inferProductTypeAndCollection(code: string) {
  const upperCode = code.toUpperCase();
  let productType = 'Needs Review';
  let collectionSlugs: string[] = ['bespoke-ready'];
  let confidence = 'low';

  if (upperCode.includes('COORD SETS (3 PIECE)')) {
    productType = '3 Piece Co-ord Set';
    collectionSlugs = ['co-ord-sets'];
    confidence = 'high';
  } else if (upperCode.includes('COORD SETS')) {
    productType = 'Co-ord Set';
    collectionSlugs = ['co-ord-sets'];
    confidence = 'high';
  } else if (upperCode.includes('SUITS')) {
    productType = 'Suit Set';
    collectionSlugs = ['suit-sets'];
    confidence = 'high';
  } else if (upperCode.includes('KURTIS')) {
    productType = 'Kurti';
    collectionSlugs = ['kurta-sets', 'everyday-luxury'];
    confidence = 'high';
  } else if (upperCode.includes('LEHENGA')) {
    productType = 'Lehenga';
    collectionSlugs = ['festive-grace'];
    confidence = 'high';
  } else if (upperCode.includes('SAREE')) {
    productType = 'Saree';
    collectionSlugs = ['festive-grace'];
    confidence = 'high';
  } else if (upperCode.includes('GOWN')) {
    productType = 'Gown';
    collectionSlugs = ['festive-grace'];
    confidence = 'high';
  } else if (upperCode.includes('JACKET')) {
    productType = 'Jacket / Overlay';
    collectionSlugs = ['everyday-luxury'];
    confidence = 'high';
  } else {
    // If we matched nothing but it's not empty, it might be partial
    if (code.trim() !== '') confidence = 'medium';
  }

  return { productType, collectionSlugs, confidence };
}

function normalizeColor(color: string) {
  if (!color) return '';
  const clean = color.replace(/\+/g, ' ').replace(/_/g, ' ').trim();
  // title case
  return clean.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

function generateSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

router.post('/excel', async (c) => {
  try {
    const body = await c.req.parseBody();
    const file = body['file'] as File;

    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    const buffer = await file.arrayBuffer();
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames.find(s => s.toLowerCase().includes('purchase inventory')) || workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = xlsx.utils.sheet_to_json(sheet, { defval: '' });

    // Grouping structure
    const groups: Record<string, any> = {};
    let rawRows = 0;
    let highConf = 0;
    let needsRev = 0;

    for (const row of rawData as any[]) {
      rawRows++;
      
      // Normalize Headers (trim spaces)
      const r: Record<string, any> = {};
      for (const k in row) {
        r[k.trim()] = row[k];
      }

      const suitCode = String(r['Suit Code'] || r['SUIT CODE'] || r['Item Code'] || '').trim();
      const rawColor = String(r['Colour'] || r['Color'] || r['COLOUR'] || '').trim();
      const size = String(r['Size'] || r['SIZE'] || '').trim();
      const qtyStr = String(r['Quantity'] || r['QTY'] || '0').trim();
      const qty = parseInt(qtyStr, 10) || 0;
      const purchasePrice = parseFloat(String(r['Purchase Price'] || r['PURCHASE PRICE'] || '0')) || 0;
      const sellingPrice = parseFloat(String(r['Selling Price'] || r['SELLING PRICE'] || '0')) || 0;
      const firmName = String(r['Firm Name'] || r['FIRM NAME'] || '').trim();
      
      if (!suitCode) continue;

      const normColor = normalizeColor(rawColor);
      const groupKey = `${suitCode}__${normColor}`.toLowerCase();

      if (!groups[groupKey]) {
        const { productType, collectionSlugs, confidence } = inferProductTypeAndCollection(suitCode);
        
        let extractedCode = suitCode.split(' ').pop() || suitCode; // e.g., A101
        if (extractedCode.length > 10) extractedCode = suitCode.substring(0, 10);
        
        const title = `${normColor} ${productType !== 'Needs Review' ? productType : 'Apparel'} ${extractedCode}`.trim();
        const slug = generateSlug(title);
        
        const isReview = productType === 'Needs Review' || sellingPrice === 0 || !size;
        
        if (confidence === 'high') highConf++;
        if (isReview) needsRev++;

        groups[groupKey] = {
          temporaryId: 'tmp_' + Math.random().toString(36).substring(7),
          sourceCode: suitCode,
          title,
          slug,
          productType,
          classificationConfidence: confidence,
          needsReview: isReview,
          colour: normColor,
          firmName,
          collections: collectionSlugs,
          variantCount: 0,
          totalStock: 0,
          priceRange: { min: sellingPrice, max: sellingPrice },
          variants: [],
          warnings: []
        };
      }

      const grp = groups[groupKey];
      
      // Handle variant
      let sizeLabel = size || 'Free Size';
      let sizeNumeric: string | null = null;
      if (/^\d+$/.test(sizeLabel)) {
        sizeNumeric = sizeLabel;
        if (sizeLabel === '38') sizeLabel = 'M';
        else if (sizeLabel === '40') sizeLabel = 'L';
        else if (sizeLabel === '42') sizeLabel = 'XL';
        else if (sizeLabel === '44') sizeLabel = 'XXL';
        else if (sizeLabel === '46') sizeLabel = '3XL';
      }

      let skuCleanCode = grp.sourceCode.split(' ').pop() || 'CODE';
      skuCleanCode = skuCleanCode.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
      const skuColor = normColor.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
      const skuSize = sizeLabel.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
      const sku = `DS-${skuCleanCode}-${skuColor}-${skuSize}`;

      grp.variants.push({
        sku,
        sizeLabel,
        sizeNumeric,
        priceInr: sellingPrice,
        costPriceInr: purchasePrice,
        stockQuantity: qty,
        firmName
      });

      grp.variantCount++;
      grp.totalStock += qty;
      if (sellingPrice < grp.priceRange.min) grp.priceRange.min = sellingPrice;
      if (sellingPrice > grp.priceRange.max) grp.priceRange.max = sellingPrice;
      
      if (!qty && !grp.needsReview) {
        grp.needsReview = true;
        needsRev++;
      }
    }

    const products = Object.values(groups);

    return c.json({
      batchId: 'import_' + Date.now(),
      sourceFile: '',
      summary: {
        rawRows,
        productGroups: products.length,
        highConfidence: highConf,
        needsReview: needsRev
      },
      products
    });

  } catch (err: any) {
    console.error('Excel parse error:', err);
    return c.json({ error: 'Failed to parse Excel file' }, 500);
  } 
});


// Zod schema for commit payload
const CommitPayloadSchema = z.object({
  batchId: z.string(),
  products: z.array(z.any()) // Accepts the full preview objects
});

router.post('/commit', async (c) => {
  const parsed = CommitPayloadSchema.safeParse((await c.req.json()));
  if (!parsed.success) {
    return c.json({ error: 'Invalid payload' }, 400);
  }

  const { batchId, products } = parsed.data;

  let importedProducts = 0;
  let importedVariants = 0;
  let skippedProducts = 0;
  const warnings: string[] = [];

  try {
    await query('BEGIN');

    for (const p of products) {
      // 1. Check duplicate slug
      const slugCheck = await query('SELECT id FROM products WHERE slug = $1', [p.slug]);
      if (slugCheck.rows.length > 0) {
        warnings.push(`Skipped "${p.title}" due to duplicate slug (${p.slug})`);
        skippedProducts++;
        continue;
      }

      // Default fields
      const fabricType = p.colour.toUpperCase().includes('JUTE') ? 'Jute Blend' : 'Unknown';
      const isKurti = p.productType === 'Kurti';
      const isSuitOrCoord = p.productType.includes('Suit') || p.productType.includes('Co-ord');
      
      let silhouette = 'Needs Review';
      if (p.productType.includes('Suit Set')) silhouette = 'Straight';
      else if (p.productType.includes('Co-ord Set')) silhouette = 'Relaxed';
      else if (p.productType.includes('3 Piece')) silhouette = 'Layered';
      else if (isKurti) silhouette = 'Straight';

      // 2. Insert product
      const resProduct = await query(
        `INSERT INTO products (
          title, slug, short_description, description, product_type, status,
          fulfillment_type, is_ready_to_ship, is_made_to_order, custom_tailoring_available,
          fabric_type, fabric_composition, fabric_feel, care_instructions, fit_note,
          silhouette, neckline, sleeve_type, kurti_length, bottom_type,
          dupatta_included, pocket_available, lead_time_min_days, lead_time_max_days,
          seo_title, seo_description
        ) VALUES (
          $1, $2, $3, $4, $5, 'draft',
          'ready_to_ship', true, false, $6,
          $7, 'To be updated', 'Boutique selected fabric with comfortable fall',
          'Gentle hand wash recommended. Wash dark colours separately. Dry in shade.',
          'Comfort fit. Please refer to size before ordering.',
          $8, 'To be updated', 'To be updated', 'To be updated', 'To be updated',
          $9, false, 2, 5,
          $10, $11
        ) RETURNING id`,
        [
          p.title, p.slug, 
          `A curated ${p.colour} ${p.productType} from Do Sakhi’s boutique inventory.`,
          `A refined ${p.productType} in ${p.colour}, selected for Do Sakhi’s boutique collection. Designed for graceful everyday wear, small gatherings, and elegant styling. Please check available sizes before ordering.`,
          p.productType,
          isSuitOrCoord, // custom_tailoring_available
          fabricType,
          silhouette,
          p.productType.includes('Suit Set') || p.productType.includes('3 Piece'), // dupatta_included
          `${p.title} | Do Sakhi`,
          `Shop ${p.title} from Do Sakhi. A curated boutique piece with elegant styling and ready-to-ship availability.`
        ]
      );
      
      const productId = resProduct.rows[0].id;
      importedProducts++;

      // 3. Insert variants safely
      for (const v of p.variants) {
        const skuCheck = await query('SELECT id FROM product_variants WHERE sku = $1', [v.sku]);
        if (skuCheck.rows.length > 0) {
          warnings.push(`Skipped variant ${v.sku} - duplicate SKU`);
          continue;
        }

        await query(
          `INSERT INTO product_variants (
            product_id, sku, color_name, size_label, size_numeric,
            price_inr, cost_price_inr, stock_quantity, low_stock_threshold
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 2)`,
          [
            productId, v.sku, p.colour, v.sizeLabel, v.sizeNumeric || null,
            v.priceInr || 0, v.costPriceInr || 0, v.stockQuantity || 0
          ]
        );
        importedVariants++;
      }

      // 4. Insert tags
      const firmName = p.variants[0]?.firmName || p.firmName;
      const tags = [
        { type: 'product_type', value: p.productType },
        { type: 'colour', value: p.colour },
        { type: 'source', value: firmName },
        { type: 'availability', value: 'ready_to_ship' },
        { type: 'import_batch', value: batchId },
        { type: 'style', value: 'quiet_luxury' },
        { type: 'style', value: 'boutique_inventory' }
      ];

      // Occasion tags
      if (p.productType.includes('Suit Set')) { tags.push({ type: 'occasion', value: 'daily_wear' }, { type: 'occasion', value: 'office' }, { type: 'occasion', value: 'small_gathering' }); }
      else if (p.productType.includes('3 Piece')) { tags.push({ type: 'occasion', value: 'daily_wear' }, { type: 'occasion', value: 'small_gathering' }); }
      else if (p.productType.includes('Co-ord')) { tags.push({ type: 'occasion', value: 'daily_wear' }, { type: 'occasion', value: 'travel' }, { type: 'occasion', value: 'casual_luxury' }); }
      else if (isKurti) { tags.push({ type: 'occasion', value: 'daily_wear' }, { type: 'occasion', value: 'office' }); }
      else if (p.productType.includes('Lehenga') || p.productType.includes('Saree') || p.productType.includes('Gown')) { tags.push({ type: 'occasion', value: 'festive' }); }

      // Image placeholder logic
      // According to rules: do not insert broken media URLs. Skip media and add needs_image = true.
      tags.push({ type: 'import_status', value: 'needs_image' });

      for (const t of tags) {
        if (t.value) {
          await query('INSERT INTO product_tags (product_id, tag_type, tag_value) VALUES ($1, $2, $3)', [productId, t.type, t.value]);
        }
      }

      // 5. Insert collections
      if (p.collections && p.collections.length > 0) {
        for (const slug of p.collections) {
          await query(
            `INSERT INTO product_collection_mapping (product_id, collection_id)
             SELECT $1, id FROM collections WHERE slug = $2
             ON CONFLICT DO NOTHING`,
            [productId, slug]
          );
        }
      }
    }

    await query('COMMIT');

    return c.json({
      success: true,
      importedProducts,
      importedVariants,
      skippedProducts,
      warnings
    });

  } catch (err: any) {
    await query('ROLLBACK');
    console.error('Import commit error:', err);
    return c.json({ error: 'Failed to commit import' }, 500);
  }
});

export default router;
