import { serve } from '@hono/node-server';
import app from './index';
import dotenv from 'dotenv';

dotenv.config();

const port = 4000;
console.log(`Starting Node Server on port ${port}...`);

const env = {
  R2_PUBLIC_URL: process.env.R2_PUBLIC_URL || '',
  ADMIN_API_KEY: process.env.ADMIN_API_KEY || ''
};

serve({
  fetch: (req) => app.fetch(req, env),
  port
});
