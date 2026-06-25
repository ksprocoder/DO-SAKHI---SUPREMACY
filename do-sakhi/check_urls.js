const { Client } = require('pg');
require('dotenv').config({ path: './.env' });

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function run() {
  await client.connect();
  const res = await client.query('SELECT id, url, product_id FROM product_media LIMIT 10;');
  console.log('Sample media rows:', res.rows);
  const count = await client.query("SELECT COUNT(*) FROM product_media WHERE url LIKE '%supabase%';");
  console.log('Count of supabase URLs:', count.rows[0].count);
  await client.end();
}
run();
