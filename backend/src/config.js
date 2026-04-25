import 'dotenv/config';

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3000,
  db: {
    host: process.env.DB_HOST || 'mysql',
    port: Number(process.env.DB_PORT) || 3306,
    database: process.env.DB_NAME || 'jsquest',
    user: process.env.DB_USER || 'jsquest',
    password: process.env.DB_PASSWORD || 'jsquestpass',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@jsquest.local',
    password: process.env.ADMIN_PASSWORD || 'admin12345',
  },
  certDir: '/app/certificates',
};