import { AsyncLocalStorage } from 'node:async_hooks';

export const dbStorage = new AsyncLocalStorage<any>();

let fallbackDb: any = null;
if (process.env.NODE_ENV !== 'production') {
  try {
    const Database = require('better-sqlite3');
    const sqliteDb = new Database('./data/local.sqlite');
    fallbackDb = {
      prepare: (query: string) => {
        let stmt = sqliteDb.prepare(query);
        return {
          bind: (...params: any[]) => {
            const mappedParams = params.map(p => typeof p === 'boolean' ? (p ? 1 : 0) : p);
            return {
              all: async () => {
                if (stmt.reader) {
                  return { results: stmt.all(...mappedParams) };
                } else {
                  stmt.run(...mappedParams);
                  return { results: [] };
                }
              }
            };
          },
          all: async () => {
            if (stmt.reader) {
              return { results: stmt.all() };
            } else {
              stmt.run();
              return { results: [] };
            }
          }
        };
      }
    };
  } catch (e) {
    console.error('Failed to load better-sqlite3 fallback', e);
  }
}

export const query = async (text: string, params: any[] = []) => {
  const db = dbStorage.getStore() || fallbackDb;
  if (!db) {
    throw new Error('Database not initialized in current context');
  }

  // Convert Postgres $1, $2 to SQLite ?
  const sqliteText = text.replace(/\$\d+/g, '?');

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
