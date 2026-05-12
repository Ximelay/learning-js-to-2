import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function IslandsPage() {
  const { user } = useAuth();
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get('/api/levels')
      .then(d => setLevels(d.levels))
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (loading) return <div className="centered">Загрузка планет...</div>;
  if (err) return <div className="centered">Ошибка: {err}</div>;

  return (
    <div className="islands-wrap">
      <h1 className="islands-title">✨ Карта планет JavaScript</h1>
      <p className="islands-sub">
        {user
          ? `Ваш прогресс: ${levels.filter(l => l.is_completed).length} из ${levels.length} планет пройдено. Всего ${user.total_score} звёзд.`
          : 'Войдите в аккаунт, чтобы начать путешествие и сохранять прогресс.'}
      </p>
      <div className="islands-grid">
        {levels.map(l => {
          const progress = l.total_tasks > 0 ? (l.tasks_completed / l.total_tasks) * 100 : 0;
          const classes = [
            'island',
            l.is_completed && 'completed',
            l.is_boss && 'boss',
            !l.is_unlocked && 'locked',
          ].filter(Boolean).join(' ');
          const content = (
            <>
              <div className="island-num">Планета {l.position}{l.is_boss && ' · БОСС'}</div>
              <div className="island-title">{l.title}</div>
              <div className="island-sub">{l.subtitle || l.description}</div>
              <div className="island-progress">
                <div className="island-progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="island-meta">
                <span>{l.tasks_completed} / {l.total_tasks} задач</span>
                <span>{l.is_unlocked ? (l.is_completed ? 'Пройдено' : 'Доступно') : '🔒 Заблокировано'}</span>
              </div>
            </>
          );
          return l.is_unlocked
            ? <Link key={l.id} to={`/levels/${l.id}`} className={classes}>{content}</Link>
            : <div key={l.id} className={classes}>{content}</div>;
        })}
      </div>
    </div>
  );
}