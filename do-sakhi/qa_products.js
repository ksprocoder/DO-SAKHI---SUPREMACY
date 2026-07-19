require('dotenv').config();
const { Client } = require('pg');

async function runQA() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  
  let passed = true;
  const issues = [];
  
  try {
    const productsRes = await client.query("SELECT p.id, p.title, p.slug, p.product_type, p.status, (SELECT COUNT(*) FROM product_variants v WHERE v.product_id = p.id) as variant_count, (SELECT size_label FROM product_variants v WHERE v.product_id = p.id LIMIT 1) as variant_size, (SELECT stock_quantity FROM product_variants v WHERE v.product_id = p.id LIMIT 1) as variant_stock, (SELECT color_name FROM product_variants v WHERE v.product_id = p.id LIMIT 1) as color_name, (SELECT price_inr FROM product_variants v WHERE v.product_id = p.id LIMIT 1) as variant_price, (SELECT COUNT(*) FROM product_media m WHERE m.product_id = p.id) as media_count, (SELECT url FROM product_media m WHERE m.product_id = p.id AND media_role = 'front' LIMIT 1) as main_image FROM products p ORDER BY p.created_at DESC LIMIT 20");
    
    // Check total products count in recent
    const drafts = productsRes.rows.filter(r => r.status === 'draft');
    console.log("Found " + drafts.length + " draft products in recent 20.");
    
    // Check for duplicate slugs
    const slugs = drafts.map(p => p.slug);
    const uniqueSlugs = [...new Set(slugs)];
    if (slugs.length !== uniqueSlugs.length) {
      issues.push("Duplicate products found by slug.");
      passed = false;
    }
    
    // Check blocked product
    const blocked = productsRes.rows.find(p => p.title.toLowerCase().includes('crimson red black embroidered designer suit set'));
    if (blocked) {
      issues.push("Blocked product 'Crimson Red Black Embroidered Designer Suit Set' was created.");
      passed = false;
    }
    
    // Check for duplicates of Cream Embroidered Jute
    const juteCount = drafts.filter(p => p.slug === 'cream-embroidered-jute-overlay-3-piece-co-ord-set').length;
    if (juteCount > 1) {
      issues.push("Duplicate Cream Embroidered Jute Overlay products found.");
      passed = false;
    }
    
    // Check variant placeholders
    let invalidVariants = 0;
    for (const p of drafts) {
      if (p.variant_count !== "1" && p.variant_count !== 1) {
        issues.push("Product " + p.slug + " has " + p.variant_count + " variants. Expected 1.");
        passed = false;
        invalidVariants++;
      }
      if (p.variant_size !== 'PENDING' || p.variant_stock !== 0) {
        issues.push("Product " + p.slug + " has invalid variant (size: " + p.variant_size + ", stock: " + p.variant_stock + ")");
        passed = false;
        invalidVariants++;
      }
      if (!p.main_image) {
         issues.push("Product " + p.slug + " missing main image.");
         passed = false;
      }
      console.log(p.slug + " | " + p.title + " | " + p.variant_size + " | " + p.main_image);
    }
    
    console.log("QA Issues Found: " + issues.length);
    if (issues.length > 0) {
      issues.forEach(i => console.error(" - " + i));
    } else {
      console.log("All DB QA checks passed.");
    }
    
  } catch (err) {
    console.error("QA Script Error:", err);
  } finally {
    await client.end();
  }
}

runQA();
