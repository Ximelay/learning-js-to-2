import fs from 'node:fs';
import path from 'node:path';
import { pool } from '../db/pool.js';
import { config } from '../config.js';
import { ApiError } from '../middleware/error.js';
import { generateCertificatePdf } from '../services/certificate.js';

async function ensureAllLevelsCompleted(userId) {
  const [[{ total_levels }]] = await pool.query('SELECT COUNT(*) AS total_levels FROM levels');
  const [[{ done_levels }]] = await pool.query(
    'SELECT COUNT(*) AS done_levels FROM user_level_progress WHERE user_id = ? AND is_completed = 1',
    [userId]
  );
  return total_levels > 0 && done_levels >= total_levels;
}

export async function issueCertificate(req, res, next) {
  try {
    const userId = req.user.id;
    const [[user]] = await pool.query('SELECT id, username, total_score FROM users WHERE id = ?', [userId]);
    if (!user) throw new ApiError(404, 'Пользователь не найден');

    const completed = await ensureAllLevelsCompleted(userId);
    if (!completed) throw new ApiError(403, 'Сертификат доступен только после прохождения всех островов');

    const [existing] = await pool.query('SELECT id, file_name FROM certificates WHERE user_id = ? LIMIT 1', [userId]);
    if (existing.length) {
      return res.json({ file_name: existing[0].file_name, already_issued: true });
    }

    const { fileName } = generateCertificatePdf({
      username: user.username,
      score: user.total_score,
      issuedAt: new Date(),
    });
    await pool.query(
      'INSERT INTO certificates (user_id, file_name) VALUES (?, ?)',
      [userId, fileName]
    );
    res.status(201).json({ file_name: fileName, already_issued: false });
  } catch (e) { next(e); }
}

export async function downloadCertificate(req, res, next) {
  try {
    const userId = req.user.id;
    const [[cert]] = await pool.query(
      'SELECT c.file_name, u.username FROM certificates c JOIN users u ON u.id = c.user_id WHERE c.user_id = ? LIMIT 1',
      [userId]
    );
    if (!cert) throw new ApiError(404, 'Сертификат ещё не выдан');
    const filePath = path.join(config.certDir, cert.file_name);
    if (!fs.existsSync(filePath)) throw new ApiError(404, 'Файл сертификата не найден на сервере');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="certificate.pdf"`);
    fs.createReadStream(filePath).pipe(res);
  } catch (e) { next(e); }
}