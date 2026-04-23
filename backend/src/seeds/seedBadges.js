import { pool } from '../db/pool.js';

// Канонический список бейджей. Источник истины.
// Сид запускается при каждом старте: новые — добавляет, существующие —
// обновляет по ключу code (что заодно чинит битую кодировку, если она
// была проставлена ранее через SQL-сид docker-entrypoint-initdb).
export const CANONICAL_BADGES = [
  { code: 'clean_coder',         title: 'Чистый Кодер',          description: 'Решите первые 5 задач без ошибок — добро пожаловать в клуб чистого кода!', icon: '🧼', trigger_type: 'score',               trigger_value: 50 },
  { code: 'mister_const',        title: 'Господин Const',        description: 'Пройдите остров «Переменные и типы данных».',                               icon: '📌', trigger_type: 'level_complete',      trigger_value: 1 },
  { code: 'guardian_conditions', title: 'Страж Условий',         description: 'Пройдите остров «Условные конструкции».',                                   icon: '⚖️', trigger_type: 'level_complete',      trigger_value: 2 },
  { code: 'loop_runner',         title: 'Бегущий по Циклам',     description: 'Пройдите остров «Циклы».',                                                  icon: '🔁', trigger_type: 'level_complete',      trigger_value: 3 },
  { code: 'functional_mage',     title: 'Функциональный Маг',    description: 'Пройдите остров «Функции».',                                                icon: '🧙', trigger_type: 'level_complete',      trigger_value: 4 },
  { code: 'structure_collector', title: 'Коллекционер Структур', description: 'Пройдите острова «Массивы» и «Объекты».',                                   icon: '📦', trigger_type: 'score',               trigger_value: 400 },
  { code: 'dom_master',          title: 'Повелитель DOM',        description: 'Пройдите остров «DOM».',                                                    icon: '🌳', trigger_type: 'level_complete',      trigger_value: 7 },
  { code: 'event_hunter',        title: 'Охотник за Событиями',  description: 'Пройдите остров «События».',                                                icon: '🎯', trigger_type: 'level_complete',      trigger_value: 8 },
  { code: 'async_wizard',        title: 'Асинхронный Волшебник', description: 'Пройдите все острова курса.',                                               icon: '✨', trigger_type: 'all_levels_complete', trigger_value: null },
  { code: 'half_way',            title: 'На Полпути',            description: 'Наберите 250 баллов.',                                                      icon: '🏁', trigger_type: 'score',               trigger_value: 250 },
  { code: 'centurion',           title: 'Сотник',                description: 'Наберите 100 баллов.',                                                      icon: '💯', trigger_type: 'score',               trigger_value: 100 },
];

export async function syncBadges() {
  for (const b of CANONICAL_BADGES) {
    await pool.query(
      `INSERT INTO badges (code, title, description, icon, trigger_type, trigger_value)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         title = VALUES(title),
         description = VALUES(description),
         icon = VALUES(icon),
         trigger_type = VALUES(trigger_type),
         trigger_value = VALUES(trigger_value)`,
      [b.code, b.title, b.description, b.icon, b.trigger_type, b.trigger_value]
    );
  }
  console.log(`[seed] Бейджи синхронизированы: ${CANONICAL_BADGES.length}`);
}
