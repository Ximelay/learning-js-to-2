import { useEffect, useMemo, useState } from 'react';
import { api } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Modal from './Modal.jsx';

export default function AdminUsers() {
  const { user: me } = useAuth();
  const [items, setItems] = useState([]);
  const [err, setErr] = useState('');
  const [q, setQ] = useState('');
  const [busyId, setBusyId] = useState(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ email: '', username: '', role: 'user' });
  const [createBusy, setCreateBusy] = useState(false);
  const [createErr, setCreateErr] = useState('');

  const [credentials, setCredentials] = useState(null);
  const [copied, setCopied] = useState('');

  const load = () => {
    setErr('');
    api.get('/admin/users').then(d => setItems(d.users)).catch(e => setErr(e.message));
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items;
    return items.filter(u =>
      u.email.toLowerCase().includes(needle) ||
      u.username.toLowerCase().includes(needle) ||
      String(u.id) === needle
    );
  }, [items, q]);

  const withBusy = async (id, fn) => {
    setBusyId(id); setErr('');
    try { await fn(); load(); }
    catch (e) { setErr(e.message); }
    finally { setBusyId(null); }
  };

  const toggleBlock = (u) => {
    if (u.id === me?.id) return;
    const action = u.is_blocked ? 'разблокировать' : 'заблокировать';
    if (!confirm(`${action[0].toUpperCase()}${action.slice(1)} пользователя ${u.username}?`)) return;
    withBusy(u.id, () => api.patch(`/admin/users/${u.id}/block`, { is_blocked: !u.is_blocked }));
  };

  const toggleApproval = (u) => {
    if (u.id === me?.id) return;
    const action = u.is_approved ? 'отозвать одобрение у' : 'одобрить';
    if (!confirm(`${action[0].toUpperCase()}${action.slice(1)} пользователя ${u.username}?`)) return;
    withBusy(u.id, () => api.patch(`/admin/users/${u.id}/approve`, { is_approved: !u.is_approved }));
  };

  const toggleRole = (u) => {
    if (u.id === me?.id) return;
    const nextRole = u.role === 'admin' ? 'user' : 'admin';
    if (!confirm(`Изменить роль пользователя ${u.username} с «${u.role}» на «${nextRole}»?`)) return;
    withBusy(u.id, () => api.patch(`/admin/users/${u.id}/role`, { role: nextRole }));
  };

  const deleteUser = (u) => {
    if (u.id === me?.id) return;
    if (!confirm(`Удалить пользователя ${u.username}? Весь его прогресс будет стёрт. Действие необратимо.`)) return;
    withBusy(u.id, () => api.del(`/admin/users/${u.id}`));
  };

  const openCreate = () => {
    setCreateForm({ email: '', username: '', role: 'user' });
    setCreateErr('');
    setCreateOpen(true);
  };

  const submitCreate = async () => {
    setCreateBusy(true); setCreateErr('');
    try {
      const res = await api.post('/admin/users', createForm);
      setCreateOpen(false);
      setCredentials(res);
      load();
    } catch (e) {
      setCreateErr(e.message);
    } finally {
      setCreateBusy(false);
    }
  };

  const copy = async (label, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(''), 1500);
    } catch {
      // буфер обмена недоступен — не критично
    }
  };

  return (
    <>
      <div className="admin-bar">
        <h2>Пользователи ({items.length})</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            placeholder="Поиск по email, имени или id"
            value={q}
            onChange={e => setQ(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--line)', minWidth: 260 }}
          />
          <button className="btn btn-primary" onClick={openCreate}>+ Создать пользователя</button>
        </div>
      </div>
      {err && <div className="error" style={{ background: 'var(--panel)', padding: 12, borderRadius: 8, marginBottom: 12 }}>{err}</div>}
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th><th>Email</th><th>Имя</th><th>Роль</th><th>Одобрение</th><th>Статус</th>
            <th>Баллы</th><th>Задач</th><th>Создан</th><th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(u => {
            const isMe = u.id === me?.id;
            const isBusy = busyId === u.id;
            return (
              <tr key={u.id} className={isMe ? 'row-self' : ''}>
                <td>{u.id}</td>
                <td>{u.email}{isMe && ' (вы)'}</td>
                <td>{u.username}</td>
                <td>
                  <span className={`chip chip-${u.role}`}>{u.role === 'admin' ? '👑 admin' : 'user'}</span>
                </td>
                <td>
                  {u.is_approved
                    ? <span className="chip chip-active">одобрен</span>
                    : <span className="chip chip-pending">⏳ ожидает</span>}
                </td>
                <td>
                  {u.is_blocked
                    ? <span className="chip chip-blocked">🚫 заблокирован</span>
                    : <span className="chip chip-active">активен</span>}
                </td>
                <td>{u.total_score}</td>
                <td>{u.tasks_completed}</td>
                <td>{new Date(u.created_at).toLocaleDateString('ru-RU')}</td>
                <td className="actions-cell">
                  {!isMe && (
                    <>
                      <button
                        className={`btn btn-sm ${u.is_approved ? 'btn-ghost' : 'btn-primary'}`}
                        onClick={() => toggleApproval(u)}
                        disabled={isBusy}
                        title={u.is_approved ? 'Отозвать одобрение' : 'Одобрить аккаунт'}
                      >
                        {u.is_approved ? 'Отозвать' : 'Одобрить'}
                      </button>
                      <button
                        className={`btn btn-sm ${u.is_blocked ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => toggleBlock(u)}
                        disabled={isBusy}
                        title={u.is_blocked ? 'Разблокировать' : 'Заблокировать'}
                      >
                        {u.is_blocked ? 'Разблок.' : 'Заблок.'}
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => toggleRole(u)}
                        disabled={isBusy}
                        title={u.role === 'admin' ? 'Понизить до user' : 'Сделать админом'}
                      >
                        {u.role === 'admin' ? '→ user' : '→ admin'}
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteUser(u)}
                        disabled={isBusy}
                      >
                        Удалить
                      </button>
                    </>
                  )}
                  {isMe && <span style={{ color: 'var(--muted)', fontSize: 12 }}>это вы</span>}
                </td>
              </tr>
            );
          })}
          {filtered.length === 0 && (
            <tr><td colSpan="10" style={{ textAlign: 'center', color: 'var(--muted)' }}>
              {q ? 'По вашему запросу никого не найдено' : 'Пользователей ещё нет'}
            </td></tr>
          )}
        </tbody>
      </table>

      {createOpen && (
        <Modal
          title="Создать пользователя"
          onClose={() => !createBusy && setCreateOpen(false)}
          onSave={submitCreate}
          saveLabel="Создать"
          busy={createBusy}
          width={520}
        >
          <div className="form" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label>Email
              <input
                type="email"
                value={createForm.email}
                onChange={e => setCreateForm({ ...createForm, email: e.target.value })}
                placeholder="student@example.com"
                required
              />
            </label>
            <label>Имя пользователя
              <input
                value={createForm.username}
                onChange={e => setCreateForm({ ...createForm, username: e.target.value })}
                placeholder="Имя для отображения"
                minLength={2}
                required
              />
            </label>
            <label>Роль
              <select
                value={createForm.role}
                onChange={e => setCreateForm({ ...createForm, role: e.target.value })}
              >
                <option value="user">user — обычный ученик</option>
                <option value="admin">admin — администратор</option>
              </select>
            </label>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: 13 }}>
              Пароль будет сгенерирован автоматически. Он покажется один раз — скопируйте и передайте ученику.
            </p>
            {createErr && <div className="error">{createErr}</div>}
          </div>
        </Modal>
      )}

      {credentials && (
        <Modal
          title="Учётная запись создана"
          onClose={() => { setCredentials(null); setCopied(''); }}
          width={560}
        >
          <p style={{ marginTop: 0 }}>
            Скопируйте данные и передайте ученику. После закрытия окна пароль будет недоступен.
          </p>
          <CredentialField label="Email" value={credentials.user.email} onCopy={copy} copied={copied === 'email'} copyKey="email" />
          <CredentialField label="Имя" value={credentials.user.username} onCopy={copy} copied={copied === 'username'} copyKey="username" />
          <CredentialField label="Пароль" value={credentials.password} onCopy={copy} copied={copied === 'password'} copyKey="password" mono />
          <button
            className="btn btn-ghost"
            style={{ marginTop: 8 }}
            onClick={() => copy('all', `Email: ${credentials.user.email}\nИмя: ${credentials.user.username}\nПароль: ${credentials.password}`)}
          >
            {copied === 'all' ? '✓ Скопировано' : 'Копировать всё'}
          </button>
        </Modal>
      )}
    </>
  );
}

function CredentialField({ label, value, onCopy, copied, copyKey, mono }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 4 }}>{label}</div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
        <code
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: 8,
            background: 'var(--panel)',
            border: '1px solid var(--line)',
            fontFamily: mono ? 'ui-monospace, SFMono-Regular, monospace' : 'inherit',
            fontSize: 14,
            wordBreak: 'break-all',
          }}
        >
          {value}
        </code>
        <button className="btn btn-ghost btn-sm" onClick={() => onCopy(copyKey, value)}>
          {copied ? '✓' : 'Копировать'}
        </button>
      </div>
    </div>
  );
}