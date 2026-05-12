import { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import Modal from './Modal.jsx';
import MarkdownEditor from '../../components/MarkdownEditor.jsx';

const empty = { position: 1, title: '', subtitle: '', description: '', theory_md: '', is_boss: false };

export default function AdminLevels() {
  const [items, setItems] = useState([]);
  const [edit, setEdit] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const load = () => api.get('/admin/levels').then(d => setItems(d.levels)).catch(e => setErr(e.message));
  useEffect(() => { load(); }, []);

  const save = async () => {
    setBusy(true); setErr('');
    try {
      const payload = { ...edit, position: Number(edit.position) };
      if (edit.id) await api.put(`/admin/levels/${edit.id}`, payload);
      else await api.post('/admin/levels', payload);
      setEdit(null); load();
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  };

  const remove = async (id) => {
    if (!confirm('Удалить уровень вместе со всеми задачами и прогрессом пользователей? Действие необратимо.')) return;
    try {
      await api.del(`/admin/levels/${id}`);
      load();
    } catch (e) { setErr(e.message); }
  };

  return (
    <>
      <div className="admin-bar">
        <h2>Уровни (планеты)</h2>
        <button className="btn btn-primary" onClick={() => setEdit({ ...empty, position: items.length + 1 })}>
          + Добавить уровень
        </button>
      </div>
      {err && <div className="error">{err}</div>}
      <table className="admin-table">
        <thead><tr><th>#</th><th>Название</th><th>Задач</th><th>Босс</th><th></th></tr></thead>
        <tbody>
          {items.map(l => (
            <tr key={l.id}>
              <td>{l.position}</td>
              <td>{l.title}</td>
              <td>{l.tasks_count}</td>
              <td>{l.is_boss ? '👑' : ''}</td>
              <td className="actions-cell">
                <button className="btn btn-ghost btn-sm" onClick={() => setEdit({ ...l })}>Редактировать</button>
                <button className="btn btn-danger btn-sm" onClick={() => remove(l.id)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {edit && (
        <Modal
          title={edit.id ? `Редактирование уровня #${edit.id}` : 'Новый уровень'}
          onClose={() => setEdit(null)}
          onSave={save}
          busy={busy}
        >
          <div className="form" style={{ maxWidth: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12 }}>
              <label>Позиция
                <input type="number" value={edit.position} onChange={e => setEdit({ ...edit, position: e.target.value })} />
              </label>
              <label>Название
                <input value={edit.title} onChange={e => setEdit({ ...edit, title: e.target.value })} />
              </label>
            </div>
            <label>Подзаголовок (короткая подпись под названием)
              <input value={edit.subtitle} onChange={e => setEdit({ ...edit, subtitle: e.target.value })} />
            </label>
            <label>Краткое описание (показывается на карточке острова)
              <textarea rows="2" value={edit.description} onChange={e => setEdit({ ...edit, description: e.target.value })} />
            </label>
            <label>Теория (Markdown)
              <MarkdownEditor value={edit.theory_md} onChange={v => setEdit({ ...edit, theory_md: v })} height={360} />
            </label>
            <label style={{ flexDirection: 'row', alignItems: 'center' }}>
              <input type="checkbox" checked={!!edit.is_boss} onChange={e => setEdit({ ...edit, is_boss: e.target.checked })} />
              &nbsp;Финальный босс (повышенная сложность)
            </label>
            {err && <div className="error">{err}</div>}
          </div>
        </Modal>
      )}
    </>
  );
}