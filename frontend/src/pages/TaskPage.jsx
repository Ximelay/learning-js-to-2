import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { api } from '../api/client.js';
import Markdown from '../components/Markdown.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function TaskPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [data, setData] = useState(null);
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    setData(null); setResults(null); setErr('');
    api.get(`/api/tasks/${taskId}`)
      .then(d => {
        setData(d);
        setCode(d.my_progress?.last_code || d.task.starter_code || '');
      })
      .catch(e => setErr(e.message));
  }, [taskId]);

  const submit = useCallback(async () => {
    setBusy(true); setResults(null);
    try {
      const r = await api.post(`/api/tasks/${taskId}/submit`, { code });
      setResults(r);
      if (r.passed) refresh();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }, [taskId, code, refresh]);

  if (err) return <div className="centered">Ошибка: {err}</div>;
  if (!data) return <div className="centered">Загрузка задачи...</div>;

  const { task, visible_tests } = data;

  const nextTaskLink = results?.passed ? (
    <button
      className="btn btn-primary"
      onClick={() => navigate(`/levels/${task.level_id}`)}
    >
      Вернуться к острову →
    </button>
  ) : null;

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Link to={`/levels/${task.level_id}`} style={{ color: 'white', textDecoration: 'none' }}>
          ← Остров {task.level_position}: {task.level_title}
        </Link>
      </div>

      <div className="task-layout">
        <div className="task-side">
          <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 700 }}>
            Задача {task.position} · {task.points} баллов
          </div>
          <h2 style={{ margin: '4px 0 12px' }}>{task.title}</h2>
          <Markdown text={task.description_md} className="" />

          {visible_tests?.length > 0 && (
            <>
              <h4 style={{ marginTop: 20 }}>Примеры проверки</h4>
              <ul>
                {visible_tests.map(tc => (
                  <li key={tc.id} style={{ fontFamily: 'SF Mono, Consolas, monospace', fontSize: 13 }}>
                    <code>{tc.call_code}</code> → <code>{tc.expected_output}</code>
                    {tc.description && <div style={{ color: 'var(--muted)', fontFamily: 'inherit', fontSize: 12 }}>{tc.description}</div>}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="task-editor-side">
          <div className="editor-wrap">
            <CodeMirror
              value={code}
              height="360px"
              extensions={[javascript()]}
              onChange={setCode}
              basicSetup={{ lineNumbers: true, foldGutter: false }}
            />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary" onClick={submit} disabled={busy}>
              {busy ? 'Проверяем...' : '▶ Запустить проверку'}
            </button>
            {nextTaskLink}
          </div>

          {results && (
            <div className="results-panel">
              {results.new_badges?.length > 0 && results.new_badges.map(b => (
                <div key={b.code} className="new-badge-toast">
                  {b.icon || '🏅'} Получен новый бейдж: <b>{b.title}</b>
                </div>
              ))}
              {results.passed && !results.already_completed && (
                <div className="new-badge-toast" style={{ background: 'linear-gradient(90deg, #2bd07e, #18a35a)', color: 'white' }}>
                  🎉 Задача решена! +{results.earned_points} баллов
                </div>
              )}
              {results.passed && results.already_completed && (
                <div className="test-result passed">Задача уже была решена ранее — баллы повторно не начисляются.</div>
              )}
              {results.level_progress?.was_first_time && (
                <div className="new-badge-toast">🏝 Остров пройден!</div>
              )}
              <div>
                {results.results.map((r, i) => (
                  <div key={i} className={`test-result ${r.passed ? 'passed' : 'failed'}`}>
                    {r.passed ? '✓' : '✗'} {r.description || `Тест ${i + 1}`}
                    {r.is_hidden && <span style={{ color: 'var(--muted)' }}> · скрытый</span>}
                    {r.error && (
                      <div className="details">
                        <b>{r.error.type}:</b> {r.error.message}
                      </div>
                    )}
                    {!r.passed && !r.error && !r.is_hidden && (
                      <div className="details">
                        Ожидалось: <code>{r.expected}</code><br/>
                        Получено: <code>{r.actual}</code>
                      </div>
                    )}
                    {r.logs?.length > 0 && (
                      <div className="details">
                        <b>Консоль:</b>
                        <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{r.logs.join('\n')}</pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}