import { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import Modal from './Modal.jsx';

const empty = { code: '', title: '', description: '', icon: '', trigger_type: 'score', trigger_value: 100 };

export default function AdminBadges() {
  const [items, setItems] = useState([]);
  const [edit, setEdit] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const load = () => api.get('/admin/badges').then(d => setItems(d.badges));
  useEffect(() => { load(); }, []);

  const save = async () => {
    setBusy(true); setErr('');
    try {
      const payload = {
        ...edit,
        trigger_value: edit.trigger_value === '' || edit.trigger_value == null ? null : Number(edit.trigger_value),
      };
      if (edit.id) await api.put(`/admin/badges/${edit.id}`, payload);
      else await api.post('/admin/badges', payload);
      setEdit(null); load();
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  };

  const remove = async (id) => {
    if (!confirm('Удалить бейдж?')) return;
    await api.del(`/admin/badges/${id}`);
    load();
  };

  return (
    <>
      <div className="admin-bar">
        <h2>Бейджи</h2>
        <button className="btn btn-primary" onClick={() => setEdit({ ...empty })}>+ Добавить</button>
      </div>
      <table className="admin-table">
        <thead><tr><th>Иконка</th><th>Код</th><th>Название</th><th>Условие</th><th></th></tr></thead>
        <tbody>
          {items.map(b => (
            <tr key={b.id}>
              <td>{b.icon}</td>
              <td><code>{b.code}</code></td>
              <td>{b.title}</td>
              <td>{b.trigger_type} {b.trigger_value ?? ''}</td>
              <td>
                <button className="btn btn-ghost" onClick={() => setEdit({ ...b })}>Ред.</button>
                {' '}
                <button className="btn btn-danger" onClick={() => remove(b.id)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {edit && (
        <Modal title={edit.id ? `Бейдж #${edit.id}` : 'Новый бейдж'} onClose={() => setEdit(null)} onSave={save} busy={busy}>
          <div className="form">
            <label>Код (латиницей, уникальный)
              <input value={edit.code} onChange={e => setEdit({ ...edit, code: e.target.value })} />
            </label>
            <label>Название
              <input value={edit.title} onChange={e => setEdit({ ...edit, title: e.target.value })} />
            </label>
            <label>Описание
              <textarea value={edit.description} onChange={e => setEdit({ ...edit, description: e.target.value })} />
            </label>
            <label>Иконка (эмодзи)
              <input value={edit.icon} onChange={e => setEdit({ ...edit, icon: e.target.value })} />
            </label>
            <label>Тип условия
              <select value={edit.trigger_type} onChange={e => setEdit({ ...edit, trigger_type: e.target.value })}>
                <option value="score">По набранным баллам</option>
                <option value="level_complete">По прохождению уровня (ID уровня)</option>
                <option value="all_levels_complete">Все уровни пройдены</option>
              </select>
            </label>
            {edit.trigger_type !== 'all_levels_complete' && (
              <label>Значение (баллы или ID уровня)
                <input type="number" value={edit.trigger_value ?? ''} onChange={e => setEdit({ ...edit, trigger_value: e.target.value })} />
              </label>
            )}
            {err && <div className="error">{err}</div>}
          </div>
        </Modal>
      )}
    </>
  );
}