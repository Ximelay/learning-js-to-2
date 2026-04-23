import { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import Modal from './Modal.jsx';

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
      if (editTask.id) await api.put(`/admin/tasks/${editTask.id}`, payload);
      else await api.post('/admin/tasks', payload);
      setEditTask(null); loadTasks();
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  };

  const removeTask = async (id) => {
    if (!confirm('Удалить задачу со всеми тестами?')) return;
    await api.del(`/admin/tasks/${id}`);
    loadTasks();
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
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  };

  const removeTC = async (id, taskId) => {
    if (!confirm('Удалить тест-кейс?')) return;
    await api.del(`/admin/test-cases/${id}`);
    loadTC(taskId);
  };

  return (
    <>
      <div className="admin-bar">
        <h2>Задачи</h2>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <select value={levelId} onChange={e => setLevelId(e.target.value)}>
            {levels.map(l => <option key={l.id} value={l.id}>{l.position}. {l.title}</option>)}
          </select>
          <button className="btn btn-primary" onClick={() => setEditTask({ ...emptyTask, level_id: Number(levelId) || 1 })}>
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
              <td>{t.tests_count}</td>
              <td>
                <button className="btn btn-ghost" onClick={() => { setEditTask({ ...t }); loadTC(t.id); }}>
                  Открыть
                </button>
                {' '}
                <button className="btn btn-danger" onClick={() => removeTask(t.id)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editTask && (
        <Modal
          title={editTask.id ? `Задача #${editTask.id}` : 'Новая задача'}
          onClose={() => { setEditTask(null); setTestCases([]); }}
          onSave={saveTask}
          busy={busy}
        >
          <div className="form">
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
            <label>Название
              <input value={editTask.title} onChange={e => setEditTask({ ...editTask, title: e.target.value })} />
            </label>
            <label>Описание (Markdown)
              <textarea rows="6" value={editTask.description_md} onChange={e => setEditTask({ ...editTask, description_md: e.target.value })} />
            </label>
            <label>Стартовый код
              <textarea rows="4" style={{ fontFamily: 'monospace' }} value={editTask.starter_code} onChange={e => setEditTask({ ...editTask, starter_code: e.target.value })} />
            </label>
            <label>Эталонное решение (необязательно)
              <textarea rows="4" style={{ fontFamily: 'monospace' }} value={editTask.solution_code || ''} onChange={e => setEditTask({ ...editTask, solution_code: e.target.value })} />
            </label>
            {err && <div className="error">{err}</div>}

            {editTask.id && (
              <>
                <h4 style={{ marginTop: 16 }}>Тест-кейсы</h4>
                <table className="admin-table" style={{ fontSize: 13 }}>
                  <thead><tr><th>#</th><th>Вызов</th><th>Ожидается</th><th>Скрытый</th><th></th></tr></thead>
                  <tbody>
                    {testCases.map(tc => (
                      <tr key={tc.id}>
                        <td>{tc.position}</td>
                        <td><code>{tc.call_code.slice(0, 30)}</code></td>
                        <td><code>{String(tc.expected_output).slice(0, 24)}</code></td>
                        <td>{tc.is_hidden ? '🔒' : ''}</td>
                        <td>
                          <button className="btn btn-ghost" onClick={() => setEditTC({ ...tc })}>Ред.</button>
                          {' '}
                          <button className="btn btn-danger" onClick={() => removeTC(tc.id, editTask.id)}>Удалить</button>
                        </td>
                      </tr>
                    ))}
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
          <div className="form">
            <label>Позиция
              <input type="number" value={editTC.position} onChange={e => setEditTC({ ...editTC, position: e.target.value })} />
            </label>
            <label>Описание
              <input value={editTC.description} onChange={e => setEditTC({ ...editTC, description: e.target.value })} />
            </label>
            <label>Код вызова (что передаётся в eval)
              <textarea rows="3" style={{ fontFamily: 'monospace' }} value={editTC.call_code} onChange={e => setEditTC({ ...editTC, call_code: e.target.value })} />
            </label>
            <label>Ожидаемый вывод (строка)
              <textarea rows="3" style={{ fontFamily: 'monospace' }} value={editTC.expected_output} onChange={e => setEditTC({ ...editTC, expected_output: e.target.value })} />
            </label>
            <label style={{ flexDirection: 'row', alignItems: 'center' }}>
              <input type="checkbox" checked={!!editTC.is_hidden} onChange={e => setEditTC({ ...editTC, is_hidden: e.target.checked })} />
              &nbsp;Скрытый (не показывать пользователю детали)
            </label>
            {err && <div className="error">{err}</div>}
          </div>
        </Modal>
      )}
    </>
  );
}