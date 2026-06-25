import { AsyncLocalStorage } from 'node:async_hooks';

export const dbStorage = new AsyncLocalStorage<D1Database>();

export const query = async (text: string, params: any[] = []) => {
  const db = dbStorage.getStore();
  if (!db) {
    throw new Error('Database not initialized in current context');
  }

  // Convert Postgres $1, $2 to SQLite ?1, ?2
  const sqliteText = text.replace(/\$(\d+)/g, '?$1');

  // Handle BEGIN, COMMIT, ROLLBACK for transactions (D1 doesn't support manual BEGIN, but supports batch)
  // For now, we will just ignore manual transactions or throw if needed.
  // We'll ignore BEGIN/COMMIT/ROLLBACK to keep the code running, D1 auto-commits.
  if (sqliteText.trim().toUpperCase() === 'BEGIN' || 
      sqliteText.trim().toUpperCase() === 'COMMIT' || 
      sqliteText.trim().toUpperCase() === 'ROLLBACK') {
    return { rows: [] };
  }

  try {
    let stmt = db.prepare(sqliteText);
    if (params.length > 0) {
      stmt = stmt.bind(...params);
    }
    
    // D1 uses .all() to get all rows
    const { results } = await stmt.all();
    
    return { rows: (results || []) as any[] };
  } catch (error) {
    console.error('D1 Query Error:', error, 'Query:', sqliteText, 'Params:', params);
    throw error;
  }
};
