import { query } from './apps/api/src/db/index.ts';

async function run() {
  const q1 = await query("SELECT id, title, slug, status FROM products ORDER BY created_at DESC LIMIT 5;");
  console.log("=== Products ===");
  console.table(q1.rows);

  const q2 = await query(`
    SELECT p.title, COUNT(pv.id) AS variant_count
    FROM products p
    LEFT JOIN product_variants pv ON pv.product_id = p.id
    GROUP BY p.id, p.title
    ORDER BY p.title;
  `);
  console.log("=== Variants ===");
  console.table(q2.rows);

  const q3 = await query(`
    SELECT p.title, COUNT(pm.id) AS media_count
    FROM products p
    LEFT JOIN product_media pm ON pm.product_id = p.id
    GROUP BY p.id, p.title
    ORDER BY p.title;
  `);
  console.log("=== Media ===");
  console.table(q3.rows);

  process.exit(0);
}
run();
