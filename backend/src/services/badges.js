import { pool } from '../db/pool.js';

/**
 * Проверяет и выдаёт пользователю все бейджи, которые он заслужил, но ещё не имеет.
 * Вызывать после каждого изменения прогресса (успешно решённой задачи).
 * @returns {Promise<Array<{code,title,icon}>>} список свежевыданных бейджей
 */
export async function awardBadgesForUser(userId) {
  const [[{ total_score }]] = await pool.query('SELECT total_score FROM users WHERE id = ?', [userId]);

  const [completedLevels] = await pool.query(
    'SELECT level_id FROM user_level_progress WHERE user_id = ? AND is_completed = 1',
    [userId]
  );
  const completedSet = new Set(completedLevels.map(r => r.level_id));

  const [[{ total_levels }]] = await pool.query('SELECT COUNT(*) AS total_levels FROM levels');
  const allLevelsDone = total_levels > 0 && completedSet.size >= total_levels;

  const [already] = await pool.query('SELECT badge_id FROM user_badges WHERE user_id = ?', [userId]);
  const ownedSet = new Set(already.map(r => r.badge_id));

  const [allBadges] = await pool.query('SELECT id, code, title, icon, trigger_type, trigger_value FROM badges');

  const newlyAwarded = [];
  for (const b of allBadges) {
    if (ownedSet.has(b.id)) continue;
    let earned = false;
    if (b.trigger_type === 'score') {
      earned = total_score >= (b.trigger_value ?? 0);
    } else if (b.trigger_type === 'level_complete') {
      earned = completedSet.has(b.trigger_value);
    } else if (b.trigger_type === 'all_levels_complete') {
      earned = allLevelsDone;
    }
    if (earned) {
      await pool.query(
        'INSERT IGNORE INTO user_badges (user_id, badge_id) VALUES (?, ?)',
        [userId, b.id]
      );
      newlyAwarded.push({ code: b.code, title: b.title, icon: b.icon });
    }
  }
  return newlyAwarded;
}