const Database = require('better-sqlite3');
const db = new Database(':memory:');
db.exec('CREATE TABLE test (id INTEGER, name TEXT)');
const stmt = db.prepare('INSERT INTO test (id, name) VALUES (?, ?) RETURNING id');
try {
  console.log(stmt.all(1, 'foo'));
} catch(e) {
  console.error(e);
}
