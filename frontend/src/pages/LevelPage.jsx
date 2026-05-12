import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import Markdown from '../components/Markdown.jsx';
import AstronautGuide from '../components/AstronautGuide.jsx';

export default function LevelPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get(`/api/levels/${id}`)
      .then(setData)
      .catch(e => setErr(e.message));
  }, [id]);

  if (err) return <div className="centered">Ошибка: {err}</div>;
  if (!data) return <div className="centered">Загрузка...</div>;

  const { level, tasks, prev_level_completed } = data;

  if (!prev_level_completed) {
    return (
      <div className="panel">
        <h2 className="panel-title">🔒 Планета заблокирована</h2>
        <p>Сначала пройдите предыдущую планету, чтобы продолжить.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>К карте планет</button>
      </div>
    );
  }

  return (
    <>
      <div className="level-head">
        <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 700 }}>
          Планета {level.position}{level.is_boss ? ' · ФИНАЛЬНЫЙ БОСС' : ''}
        </div>
        <h1 style={{ margin: '4px 0' }}>{level.title}</h1>
        <p style={{ color: 'var(--muted)', margin: 0 }}>{level.subtitle || level.description}</p>
      </div>

      <Markdown text={level.theory_md} />

      <h3 style={{ color: 'white', margin: '8px 0 12px' }}>Задачи</h3>
      <div className="task-list">
        {tasks.map(t => {
          const classes = ['task-card', t.status === 'completed' && 'completed', !t.is_unlocked && 'locked']
            .filter(Boolean).join(' ');
          const inner = (
            <>
              <div className="task-card-num">Задача {t.position}</div>
              <div className="task-card-title">{t.title}</div>
              <div className="task-card-pts">
                {t.status === 'completed' ? '✓ решено' : (t.is_unlocked ? 'Доступно' : '🔒 Заблокировано')}
                {' · '}{t.points} звёзд
              </div>
            </>
          );
          return t.is_unlocked
            ? <Link key={t.id} to={`/tasks/${t.id}`} className={classes}>{inner}</Link>
            : <div key={t.id} className={classes}>{inner}</div>;
        })}
      </div>
        <AstronautGuide variant="planet" levelId={Number(id)} />
    </>
  );
}