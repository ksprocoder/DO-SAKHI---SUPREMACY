const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;

const sqlContent = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');

// Splitting statements carefully.
// A statements separator is a semicolon followed by a newline, or we can parse statement boundaries.
// We can use a regex to split by semicolon followed by whitespace/newlines, but ignore semicolons inside DO $$ ... $$;
const statements = [];
let currentStatement = '';
let insideDollarBlock = false;

const lines = sqlContent.split('\n');
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

async function main() {
  const client = new Client({ connectionString });
  await client.connect();
  console.log("Connected to database. Executing statements one by one...\n");
  
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i].trim();
    if (!stmt) continue;
    
    console.log(`--- Executing Statement ${i + 1} ---`);
    console.log(stmt.substring(0, 150) + "...\n");
    
    try {
      await client.query(stmt);
      console.log(`Success.\n`);
    } catch (err) {
      console.error(`ERROR at Statement ${i + 1}:`, err.message);
      console.error(`Full Statement:\n`, stmt);
      break;
    }
  }
  await client.end();
}

main();
