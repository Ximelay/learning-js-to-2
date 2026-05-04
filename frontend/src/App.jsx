import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import WelcomePage from './pages/WelcomePage.jsx';
import IslandsPage from './pages/IslandsPage.jsx';
import LevelPage from './pages/LevelPage.jsx';
import TaskPage from './pages/TaskPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import AdminPage from './pages/AdminPage.jsx';

function Protected({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="centered">Загрузка...</div>;
  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

function HomeRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="centered">Загрузка...</div>;
  return user ? <IslandsPage /> : <WelcomePage />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomeRoute />} />
        <Route path="/levels/:id" element={<Protected><LevelPage /></Protected>} />
        <Route path="/tasks/:taskId" element={<Protected><TaskPage /></Protected>} />
        <Route path="/profile" element={<Protected><ProfilePage /></Protected>} />
        <Route path="/admin/*" element={<Protected role="admin"><AdminPage /></Protected>} />
        <Route path="*" element={<div className="centered">Страница не найдена</div>} />
      </Route>
    </Routes>
  );
}