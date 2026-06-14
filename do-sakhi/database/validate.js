const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("Error: DATABASE_URL is not set.");
  process.exit(1);
}

async function runQuery(client, description, query) {
  console.log(`--- ${description} ---`);
  try {
    const res = await client.query(query);
    console.table(res.rows);
    console.log('\n');
  } catch (err) {
    console.error(`Error running ${description}:`, err.message);
  }
}

async function main() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log("Connected to database for validation.\n");

    // 1. List tables
    await runQuery(client, "Tables in Public Schema", `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    // 2. Count records
    await runQuery(client, "Record Counts", `
      SELECT 
        (SELECT COUNT(*) FROM products) AS product_count,
        (SELECT COUNT(*) FROM product_variants) AS variant_count,
        (SELECT COUNT(*) FROM collections) AS collection_count,
        (SELECT COUNT(*) FROM product_media) AS media_count,
        (SELECT COUNT(*) FROM custom_tailoring_details) AS tailoring_count;
    `);

    // 3. Stock levels
    await runQuery(client, "Stock Levels per Variant", `
      SELECT 
        p.title,
        pv.size_label,
        pv.size_numeric,
        pv.stock_quantity,
        pv.reserved_quantity,
        (pv.stock_quantity - pv.reserved_quantity) AS available_stock
      FROM products p
      JOIN product_variants pv ON pv.product_id = p.id
      ORDER BY p.title, pv.size_label;
    `);

    // 4. Order & tailoring status
    await runQuery(client, "Order and Tailoring Status", `
      SELECT 
        o.order_number,
        o.status AS order_status,
        o.payment_status,
        oi.product_title,
        oi.tailoring_status,
        ctd.status AS tailoring_detail_status
      FROM orders o
      JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN custom_tailoring_details ctd ON ctd.order_item_id = oi.id
      ORDER BY o.created_at DESC;
    `);

    // 5. Media validation
    await runQuery(client, "Media Count per Product", `
      SELECT 
        p.title,
        COUNT(pm.id) AS media_count
      FROM products p
      LEFT JOIN product_media pm ON pm.product_id = p.id
      GROUP BY p.title
      ORDER BY p.title;
    `);

    await runQuery(client, "Total Media Records", `
      SELECT COUNT(*) AS total_media_records FROM product_media;
    `);

  } catch (err) {
    console.error("Validation failed:", err);
  } finally {
    await client.end();
  }
}

main();
