import bcrypt from 'bcrypt';
import { pool } from './pool.js';
import { config } from '../config.js';

export async function ensureAdmin() {
  const [rows] = await pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [config.admin.email]);
  if (rows.length) return;
  const hash = await bcrypt.hash(config.admin.password, 10);
  await pool.query(
    'INSERT INTO users (email, username, password_hash, role) VALUES (?, ?, ?, "admin")',
    [config.admin.email, 'admin', hash]
  );
  console.log(`[seed] admin user создан: ${config.admin.email}`);
}