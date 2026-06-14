import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from root if not already loaded
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Helper for single query execution
export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};
