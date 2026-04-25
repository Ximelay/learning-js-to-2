import { useEffect, useState } from 'react';
import { api, certificateDownloadUrl } from '../api/client.js';

export default function ProfilePage() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () => {
    api.get('/api/profile').then(setData).catch(e => setErr(e.message));
  };

  useEffect(() => { load(); }, []);

  const issueCert = async () => {
    setBusy(true);
    try {
      await api.post('/api/certificate/issue');
      load();
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  };

  if (err) return <div className="centered">Ошибка: {err}</div>;
  if (!data) return <div className="centered">Загрузка...</div>;

  const { user, totals, level_progress, badges, all_badges, certificate } = data;
  const ownedCodes = new Set(badges.map(b => b.code));
  const allDone = level_progress.length > 0 && level_progress.every(l => l.is_completed);

  return (
    <>
      <div className="panel" style={{ marginBottom: 20 }}>
        <h2 className="panel-title">👤 {user.username}</h2>
        <p style={{ color: 'var(--muted)' }}>
          {user.email} · роль: {user.role === 'admin' ? 'администратор' : 'ученик'}
        </p>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 12 }}>
          <Stat label="Баллы" value={user.total_score} />
          <Stat label="Задач решено" value={`${totals.tasks_completed} / ${totals.total_tasks}`} />
          <Stat label="Бейджи" value={`${badges.length} / ${all_badges.length}`} />
        </div>
      </div>

      <div className="profile-grid">
        <div className="panel">
          <h3 className="panel-title">Прогресс по островам</h3>
          {level_progress.map(l => (
            <div key={l.level_id} className="progress-row">
              <div style={{ flex: 1.3 }}>
                <div style={{ fontWeight: 600 }}>
                  {l.is_boss ? '👑 ' : ''}Остров {l.position}: {l.title}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                  {l.tasks_completed} / {l.total_tasks} задач
                  {l.is_completed && ' · ✓ пройдено'}
                </div>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill"
                  style={{ width: `${l.total_tasks ? (l.tasks_completed / l.total_tasks) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}

          <div style={{ marginTop: 20 }}>
            <h4>🎓 Сертификат</h4>
            {allDone ? (
              certificate ? (
                <a href={certificateDownloadUrl()} className="btn btn-primary" target="_blank" rel="noreferrer">
                  📥 Скачать сертификат (PDF)
                </a>
              ) : (
                <button className="btn btn-primary" onClick={issueCert} disabled={busy}>
                  {busy ? 'Выпускаем...' : '🎓 Получить сертификат'}
                </button>
              )
            ) : (
              <p style={{ color: 'var(--muted)' }}>
                Сертификат станет доступен после прохождения всех островов.
              </p>
            )}
          </div>
        </div>

        <div className="panel">
          <h3 className="panel-title">🏅 Бейджи</h3>
          <div className="badge-grid">
            {all_badges.map(b => (
              <div key={b.code} className={`badge ${ownedCodes.has(b.code) ? 'owned' : ''}`}>
                <div className="badge-icon">{ownedCodes.has(b.code) ? b.icon : '🔒'}</div>
                <div className="badge-title">{b.title}</div>
                <div className="badge-desc">{b.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700 }}>{value}</div>
    </div>
  );
}