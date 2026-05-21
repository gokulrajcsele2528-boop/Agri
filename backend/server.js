import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './db/database.js';
import authRoutes from './routes/auth.js';
import hubRoutes from './routes/hubs.js';
import produceRoutes from './routes/produce.js';
import transportRoutes from './routes/transport.js';
import schemeRoutes from './routes/schemes.js';
import marketRoutes from './routes/market.js';
import analyticsRoutes from './routes/analytics.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

export default app;

initDatabase();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    project: 'AgriRoute NE',
    title: 'Low-cost Transportation Solution for Agricultural Produce - North Eastern Region',
    version: '1.0.0',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/hubs', hubRoutes);
app.use('/api/produce', produceRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Only start the HTTP server when running directly (local dev), not on Vercel
const isMain = process.argv[1] &&
  (process.argv[1].endsWith('server.js') || process.argv[1].endsWith('dev.js'));

if (isMain) {
  const server = app.listen(PORT, () => {
    console.log(`AgriRoute NE API running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\nPort ${PORT} is already in use. Stop the other server first.\n`);
      process.exit(1);
    }
    throw err;
  });

  function shutdown() {
    if (!server.listening) { process.exit(0); return; }
    server.close(() => setTimeout(() => process.exit(0), 150));
  }
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}
