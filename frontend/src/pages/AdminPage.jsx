import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import AdminLevels from './admin/AdminLevels.jsx';
import AdminTasks from './admin/AdminTasks.jsx';
import AdminBadges from './admin/AdminBadges.jsx';
import AdminUsers from './admin/AdminUsers.jsx';

export default function AdminPage() {
  return (
    <div className="admin-layout">
      <aside className="admin-nav">
        <NavLink to="levels">Уровни</NavLink>
        <NavLink to="tasks">Задачи</NavLink>
        <NavLink to="badges">Бейджи</NavLink>
        <NavLink to="users">Пользователи</NavLink>
      </aside>
      <section>
        <Routes>
          <Route index element={<Navigate to="levels" replace />} />
          <Route path="levels" element={<AdminLevels />} />
          <Route path="tasks" element={<AdminTasks />} />
          <Route path="badges" element={<AdminBadges />} />
          <Route path="users" element={<AdminUsers />} />
        </Routes>
      </section>
    </div>
  );
}