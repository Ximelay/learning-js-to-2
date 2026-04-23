import { useEffect, useState } from 'react';
import { api } from '../../api/client.js';

export default function AdminUsers() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get('/admin/users').then(d => setItems(d.users)).catch(e => setErr(e.message));
  }, []);

  if (err) return <div className="error">{err}</div>;

  return (
    <>
      <div className="admin-bar"><h2>Пользователи</h2></div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th><th>Email</th><th>Имя</th><th>Роль</th><th>Баллы</th><th>Задач решено</th><th>Создан</th>
          </tr>
        </thead>
        <tbody>
          {items.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.email}</td>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>{u.total_score}</td>
              <td>{u.tasks_completed}</td>
              <td>{new Date(u.created_at).toLocaleString('ru-RU')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}