import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import IslandsPage from './pages/IslandsPage.jsx';
import LevelPage from './pages/LevelPage.jsx';
import TaskPage from './pages/TaskPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import AdminPage from './pages/AdminPage.jsx';

function Protected({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="centered">Загрузка...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<IslandsPage />} />
        <Route path="/levels/:id" element={<Protected><LevelPage /></Protected>} />
        <Route path="/tasks/:taskId" element={<Protected><TaskPage /></Protected>} />
        <Route path="/profile" element={<Protected><ProfilePage /></Protected>} />
        <Route path="/admin/*" element={<Protected role="admin"><AdminPage /></Protected>} />
        <Route path="*" element={<div className="centered">Страница не найдена</div>} />
      </Route>
    </Routes>
  );
}