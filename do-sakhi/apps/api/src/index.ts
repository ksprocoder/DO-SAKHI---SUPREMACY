import express, { Request, Response } from 'express';
import cors from 'cors';
import { query } from './db';

import productRoutes from './routes/products';
import cartRoutes from './routes/cart';
import checkoutRoutes from './routes/checkout';
import adminRoutes from './routes/admin';
import importRoutes from './routes/importRoutes';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to Do Sakhi API. Use /api/v1/health to check status.' });
});

// GET /api/v1/health
app.get('/api/v1/health', async (req: Request, res: Response) => {
  try {
    const dbResult = await query('SELECT NOW() as time');
    res.json({
      status: 'ok',
      service: 'do-sakhi-api',
      database: 'connected',
      time: dbResult.rows?.[0]?.time || null,
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'error',
      dbConnection: 'failed',
    });
  }
});

// Routes
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/checkout', checkoutRoutes);
app.use('/api/v1/admin/import', importRoutes);
app.use('/api/v1/admin', adminRoutes);

// Catch-all for undefined routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(port, () => {
  console.log(`Do Sakhi Backend API running on port ${port}`);
});
