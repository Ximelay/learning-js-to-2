import { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { api } from '../../api/client.js';
import Modal from './Modal.jsx';
import MarkdownEditor from '../../components/MarkdownEditor.jsx';

const emptyTask = { level_id: 1, position: 1, title: '', description_md: '', starter_code: '', points: 10, solution_code: '' };
const emptyCase = { position: 1, call_code: '', expected_output: '', is_hidden: false, description: '' };

export default function AdminTasks() {
  const [levels, setLevels] = useState([]);
  const [levelId, setLevelId] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [editTC, setEditTC] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get('/admin/levels').then(d => {
      setLevels(d.levels);
      if (d.levels.length && !levelId) setLevelId(String(d.levels[0].id));
    });
  }, []);

  const loadTasks = () => {
    if (!levelId) return;
    api.get(`/admin/tasks?level_id=${levelId}`).then(d => setTasks(d.tasks));
  };
  useEffect(() => { loadTasks(); }, [levelId]);

  const loadTC = (taskId) => api.get(`/admin/tasks/${taskId}`).then(d => setTestCases(d.test_cases));

  const saveTask = async () => {
    setBusy(true); setErr('');
    try {
      const payload = {
        ...editTask,
        level_id: Number(editTask.level_id),
        position: Number(editTask.position),
        points: Number(editTask.points),
      };
      if (editTask.id) {
        await api.put(`/admin/tasks/${editTask.id}`, payload);
      } else {
        const { id } = await api.post('/admin/tasks', payload);
        setEditTask({ ...editTask, ...payload, id });
        setTestCases([]);
      }
      loadTasks();
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  };

  const removeTask = async (id) => {
    if (!confirm('Удалить задачу вместе со всеми тест-кейсами и прогрессом пользователей?')) return;
    try {
      await api.del(`/admin/tasks/${id}`);
      loadTasks();
    } catch (e) { setErr(e.message); }
  };

  const saveTC = async () => {
    setBusy(true); setErr('');
    try {
      const payload = {
        ...editTC,
        task_id: Number(editTC.task_id),
        position: Number(editTC.position),
      };
      if (editTC.id) await api.put(`/admin/test-cases/${editTC.id}`, payload);
      else await api.post('/admin/test-cases', payload);
      setEditTC(null);
      loadTC(editTC.task_id);
      loadTasks();
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  };

  const removeTC = async (id, taskId) => {
    if (!confirm('Удалить тест-кейс?')) return;
    await api.del(`/admin/test-cases/${id}`);
    loadTC(taskId);
    loadTasks();
  };

  return (
    <>
      <div className="admin-bar">
        <h2>Задачи</h2>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <select value={levelId} onChange={e => setLevelId(e.target.value)}>
            {levels.map(l => <option key={l.id} value={l.id}>{l.position}. {l.title}</option>)}
          </select>
          <button
            className="btn btn-primary"
            onClick={() => setEditTask({ ...emptyTask, level_id: Number(levelId) || 1, position: tasks.length + 1 })}
          >
            + Задача
          </button>
        </div>
      </div>

      <table className="admin-table">
        <thead><tr><th>#</th><th>Название</th><th>Баллы</th><th>Тестов</th><th></th></tr></thead>
        <tbody>
          {tasks.map(t => (
            <tr key={t.id}>
              <td>{t.position}</td>
              <td>{t.title}</td>
              <td>{t.points}</td>
              <td>{t.tests_count || <span style={{ color: 'var(--warn)' }}>0 ⚠</span>}</td>
              <td className="actions-cell">
                <button className="btn btn-ghost btn-sm" onClick={() => { setEditTask({ ...t }); loadTC(t.id); }}>
                  Открыть
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => removeTask(t.id)}>Удалить</button>
              </td>
            </tr>
          ))}
          {tasks.length === 0 && (
            <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--muted)' }}>Задач на этом уровне пока нет</td></tr>
          )}
        </tbody>
      </table>

      {editTask && (
        <Modal
          title={editTask.id ? `Задача #${editTask.id}` : 'Новая задача'}
          onClose={() => { setEditTask(null); setTestCases([]); }}
          onSave={saveTask}
          busy={busy}
          saveLabel={editTask.id ? 'Сохранить' : 'Создать и открыть'}
        >
          <div className="form" style={{ maxWidth: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px', gap: 12 }}>
              <label>Уровень
                <select value={editTask.level_id} onChange={e => setEditTask({ ...editTask, level_id: e.target.value })}>
                  {levels.map(l => <option key={l.id} value={l.id}>{l.position}. {l.title}</option>)}
                </select>
              </label>
              <label>Позиция
                <input type="number" value={editTask.position} onChange={e => setEditTask({ ...editTask, position: e.target.value })} />
              </label>
              <label>Баллы
                <input type="number" value={editTask.points} onChange={e => setEditTask({ ...editTask, points: e.target.value })} />
              </label>
            </div>
            <label>Название
              <input value={editTask.title} onChange={e => setEditTask({ ...editTask, title: e.target.value })} />
            </label>
            <label>Описание (Markdown)
              <MarkdownEditor value={editTask.description_md} onChange={v => setEditTask({ ...editTask, description_md: v })} height={240} />
            </label>
            <label>Стартовый код (показывается ученику при открытии задачи)
              <div className="editor-wrap" style={{ border: '1px solid var(--line)' }}>
                <CodeMirror
                  value={editTask.starter_code || ''}
                  height="140px"
                  extensions={[javascript()]}
                  onChange={v => setEditTask({ ...editTask, starter_code: v })}
                  basicSetup={{ lineNumbers: true, foldGutter: false }}
                />
              </div>
            </label>
            <label>Эталонное решение (для справки админа, не показывается ученикам)
              <div className="editor-wrap" style={{ border: '1px solid var(--line)' }}>
                <CodeMirror
                  value={editTask.solution_code || ''}
                  height="120px"
                  extensions={[javascript()]}
                  onChange={v => setEditTask({ ...editTask, solution_code: v })}
                  basicSetup={{ lineNumbers: true, foldGutter: false }}
                />
              </div>
            </label>
            {err && <div className="error">{err}</div>}

            {editTask.id ? (
              <>
                <h4 style={{ marginTop: 16, marginBottom: 4 }}>Тест-кейсы ({testCases.length})</h4>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>
                  Задача без тест-кейсов не может быть проверена. Добавьте хотя бы один.
                </div>
                <table className="admin-table" style={{ fontSize: 13 }}>
                  <thead><tr><th>#</th><th>Вызов</th><th>Ожидается</th><th>Скрытый</th><th></th></tr></thead>
                  <tbody>
                    {testCases.map(tc => (
                      <tr key={tc.id}>
                        <td>{tc.position}</td>
                        <td><code>{tc.call_code.slice(0, 40)}{tc.call_code.length > 40 ? '…' : ''}</code></td>
                        <td><code>{String(tc.expected_output).slice(0, 30)}{String(tc.expected_output).length > 30 ? '…' : ''}</code></td>
                        <td>{tc.is_hidden ? '🔒' : ''}</td>
                        <td className="actions-cell">
                          <button className="btn btn-ghost btn-sm" onClick={() => setEditTC({ ...tc })}>Ред.</button>
                          <button className="btn btn-danger btn-sm" onClick={() => removeTC(tc.id, editTask.id)}>✕</button>
                        </td>
                      </tr>
                    ))}
                    {testCases.length === 0 && (
                      <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--warn)' }}>Нет тест-кейсов</td></tr>
                    )}
                  </tbody>
                </table>
                <button
                  className="btn btn-primary"
                  style={{ marginTop: 8 }}
                  onClick={() => setEditTC({ ...emptyCase, task_id: editTask.id, position: testCases.length + 1 })}
                >
                  + Тест-кейс
                </button>
              </>
            ) : (
              <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 8 }}>
                Сохраните задачу, чтобы добавить тест-кейсы.
              </div>
            )}
          </div>
        </Modal>
      )}

      {editTC && (
        <Modal
          title={editTC.id ? `Тест-кейс #${editTC.id}` : 'Новый тест-кейс'}
          onClose={() => setEditTC(null)}
          onSave={saveTC}
          busy={busy}
        >
          <div className="form" style={{ maxWidth: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12 }}>
              <label>Позиция
                <input type="number" value={editTC.position} onChange={e => setEditTC({ ...editTC, position: e.target.value })} />
              </label>
              <label>Описание (что проверяем, видно ученику)
                <input value={editTC.description} onChange={e => setEditTC({ ...editTC, description: e.target.value })} />
              </label>
            </div>
            <label>Код вызова — JS-выражение, результат которого сравнивается с ожидаемым
              <div className="editor-wrap" style={{ border: '1px solid var(--line)' }}>
                <CodeMirror
                  value={editTC.call_code}
                  height="80px"
                  extensions={[javascript()]}
                  onChange={v => setEditTC({ ...editTC, call_code: v })}
                  basicSetup={{ lineNumbers: false, foldGutter: false }}
                />
              </div>
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                Пример: <code>sum(2, 3)</code> или <code>JSON.stringify(solve([1,2,3]))</code>
              </span>
            </label>
            <label>Ожидаемый вывод (строка)
              <textarea rows="3" style={{ fontFamily: 'SF Mono, Consolas, monospace' }}
                value={editTC.expected_output}
                onChange={e => setEditTC({ ...editTC, expected_output: e.target.value })} />
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                Для чисел: <code>5</code>, для строк: <code>Привет</code> (без кавычек),
                для массивов/объектов: JSON, например <code>[1,2,3]</code>
              </span>
            </label>
            <label style={{ flexDirection: 'row', alignItems: 'center' }}>
              <input type="checkbox" checked={!!editTC.is_hidden} onChange={e => setEditTC({ ...editTC, is_hidden: e.target.checked })} />
              &nbsp;Скрытый — ученик увидит только факт прохождения, без деталей
            </label>
            {err && <div className="error">{err}</div>}
          </div>
        </Modal>
      )}
    </>
  );
}