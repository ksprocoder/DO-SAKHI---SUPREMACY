const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("Error: DATABASE_URL is not set in the environment or .env file.");
  process.exit(1);
}

async function runSQLFile(client, filename) {
  const filePath = path.join(__dirname, filename);
  console.log(`Reading ${filename}...`);
  const sql = fs.readFileSync(filePath, 'utf8');
  
  console.log(`Executing ${filename} on database...`);
  
  const statements = [];
  let currentStatement = '';
  let insideDollarBlock = false;

  const lines = sql.split('\n');
  for (let line of lines) {
    currentStatement += line + '\n';
    if (line.includes('DO $$')) {
      insideDollarBlock = true;
    }
    if (line.includes('END $$;')) {
      insideDollarBlock = false;
      statements.push(currentStatement);
      currentStatement = '';
    } else if (!insideDollarBlock && line.trim().endsWith(';')) {
      statements.push(currentStatement);
      currentStatement = '';
    }
  }
  if (currentStatement.trim()) {
    statements.push(currentStatement);
  }

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i].trim();
    if (!stmt) continue;
    try {
      await client.query(stmt);
    } catch (err) {
      console.error(`Error executing Statement ${i + 1} of ${filename}:`, err.message);
      console.error(`Full SQL:`, stmt);
      throw err;
    }
  }
  console.log(`Successfully executed ${filename}\n`);
}

async function main() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log("Connected to database successfully.\n");
    
    // Execute reset, schema, then seed
    await runSQLFile(client, 'reset.sql');
    await runSQLFile(client, 'schema.sql');
    await runSQLFile(client, 'seed.sql');
    
    console.log("Database initialized and seeded successfully.");
  } catch (err) {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
