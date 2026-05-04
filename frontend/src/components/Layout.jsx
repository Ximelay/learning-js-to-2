import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">🗺️ JS-Квест</Link>
        <nav className="nav">
          <NavLink to="/" end>Острова</NavLink>
          {user && <NavLink to="/profile">Личный кабинет</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin">Админка</NavLink>}
        </nav>
        <div className="auth-controls">
          {user ? (
            <>
              <span className="user-chip">{user.username} · {user.total_score} 🏆</span>
              <button onClick={onLogout} className="btn btn-ghost">Выйти</button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">Вход</Link>
          )}
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">JS-Квест · образовательная платформа</footer>
    </div>
  );
}