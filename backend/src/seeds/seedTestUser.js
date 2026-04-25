import bcrypt from 'bcrypt';
import { pool, waitForDatabase } from '../db/pool.js';
import { recomputeLevelProgress } from '../services/progress.js';
import { awardBadgesForUser } from '../services/badges.js';

const TEST_USER = {
  email: 'test@jsquest.local',
  username: 'test',
  password: 'test12345',
};

async function main() {
  await waitForDatabase();

  const hash = await bcrypt.hash(TEST_USER.password, 10);
  await pool.query(
    `INSERT INTO users (email, username, password_hash, role)
     VALUES (?, ?, ?, 'user')
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), is_blocked = 0`,
    [TEST_USER.email, TEST_USER.username, hash]
  );
  const [[user]] = await pool.query(
    'SELECT id FROM users WHERE email = ? LIMIT 1',
    [TEST_USER.email]
  );
  const userId = user.id;

  const [tasks] = await pool.query('SELECT id, level_id, points FROM tasks');
  if (tasks.length === 0) {
    console.error('[seed] tasks таблица пустая — сначала запустите backend, чтобы он засеял контент');
    process.exit(1);
  }

  const now = new Date();
  let totalScore = 0;
  for (const t of tasks) {
    totalScore += t.points;
    await pool.query(
      `INSERT INTO user_task_progress
         (user_id, task_id, status, attempts, first_completed_at, last_completed_at)
       VALUES (?, ?, 'completed', 1, ?, ?)
       ON DUPLICATE KEY UPDATE
         status = 'completed',
         attempts = GREATEST(attempts, 1),
         first_completed_at = COALESCE(first_completed_at, VALUES(first_completed_at)),
         last_completed_at = VALUES(last_completed_at)`,
      [userId, t.id, now, now]
    );
  }

  await pool.query('UPDATE users SET total_score = ? WHERE id = ?', [totalScore, userId]);

  const [levels] = await pool.query('SELECT id FROM levels ORDER BY position ASC');
  for (const lvl of levels) {
    await recomputeLevelProgress(userId, lvl.id);
  }

  const newBadges = await awardBadgesForUser(userId);

  console.log('[seed] Тестовый пользователь готов:');
  console.log(`  email:    ${TEST_USER.email}`);
  console.log(`  username: ${TEST_USER.username}`);
  console.log(`  password: ${TEST_USER.password}`);
  console.log(`  задач завершено: ${tasks.length}`);
  console.log(`  уровней:         ${levels.length}`);
  console.log(`  total_score:     ${totalScore}`);
  console.log(`  бейджей выдано:  ${newBadges.length}`);

  await pool.end();
}

main().catch(err => {
  console.error('[seed-test-user]', err);
  process.exit(1);
});