import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { query, dbStorage } from './db';

import productRoutes from './routes/products';
import cartRoutes from './routes/cart';
import checkoutRoutes from './routes/checkout';
import adminRoutes from './routes/admin';
import importRoutes from './routes/importRoutes';

// Env interface for Cloudflare Bindings
export interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
  R2_PUBLIC_URL: string;
}

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors());

// Middleware to inject D1 database into AsyncLocalStorage
app.use('*', async (c, next) => {
  return dbStorage.run(c.env.DB, async () => {
    await next();
  });
});

// Root endpoint
app.get('/', (c) => {
  return c.json({ message: 'Welcome to Do Sakhi API. Use /api/v1/health to check status.' });
});

// GET /api/v1/health
app.get('/api/v1/health', async (c) => {
  try {
    const dbResult = await query('SELECT CURRENT_TIMESTAMP as time');
    return c.json({
      status: 'ok',
      service: 'do-sakhi-api-cloudflare',
      database: 'connected',
      time: dbResult.rows?.[0]?.time || null,
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return c.json({
      status: 'error',
      dbConnection: 'failed',
    }, 500);
  }
});

// Routes
app.route('/api/v1/products', productRoutes);
app.route('/api/v1/cart', cartRoutes);
app.route('/api/v1/checkout', checkoutRoutes);
app.route('/api/v1/admin/import', importRoutes);
app.route('/api/v1/admin', adminRoutes);

// Catch-all for undefined routes
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

export default app;
