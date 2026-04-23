import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config.js';

process.on('uncaughtException', (err) => {
  console.error('[uncaughtException]', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('[unhandledRejection]', reason);
});
import { waitForDatabase } from './db/pool.js';
import { ensureAdmin } from './db/ensureAdmin.js';
import { seedContentIfEmpty } from './seeds/seedContent.js';
import { syncBadges } from './seeds/seedBadges.js';
import { notFound, errorHandler } from './middleware/error.js';
import authRoutes from './routes/auth.routes.js';
import apiRoutes from './routes/api.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();

app.use(express.json({ limit: '200kb' }));
app.use(cookieParser());
app.use(cors({
  origin: config.frontendOrigin,
  credentials: true,
}));

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

async function start() {
  console.log('[startup] Ожидание базы данных...');
  await waitForDatabase();
  console.log('[startup] База готова');
  await ensureAdmin();
  await seedContentIfEmpty();
  await syncBadges();
  app.listen(config.port, () => {
    console.log(`[startup] Backend слушает порт ${config.port}`);
  });
}

start().catch(err => {
  console.error('[fatal]', err);
  process.exit(1);
});