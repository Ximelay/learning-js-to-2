import { useEffect, useState } from 'react';
import { Outlet, Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import OnboardingModal from './OnboardingModal.jsx';
import AstronautGuide from './AstronautGuide.jsx';

const ONBOARDING_KEY = 'js-quest-onboarding-seen';

export default function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [showOnboarding, setShowOnboarding] = useState(false);

    useEffect(() => {
        if (!user) return;
        if (location.pathname !== '/') return;
        const seenKey = `${ONBOARDING_KEY}:${user.id}`;
        if (localStorage.getItem(seenKey)) return;
        setShowOnboarding(true);
        localStorage.setItem(seenKey, '1');
    }, [user, location.pathname]);

    const onLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="app-shell">
            <header className="topbar">
                <Link to="/" className="brand">🌌 JS-Квест</Link>
                <nav className="nav">
                    <NavLink to="/" end>{user ? 'Планеты' : 'О проекте'}</NavLink>
                    {user && <NavLink to="/profile">Профиль</NavLink>}
                    {user?.role === 'admin' && <NavLink to="/admin">Админка</NavLink>}
                    {user && (
                        <button type="button" className="nav-link-btn" onClick={() => setShowOnboarding(true)}>
                            Как играть?
                        </button>
                    )}
                </nav>
                <div className="auth-controls">
                    {user ? (
                        <>
                            <span className="user-chip">{user.username} · {user.total_score} ⭐</span>
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

            <footer className="footer">🌌 JS-Квест · Галактика JavaScript</footer>

            <OnboardingModal open={showOnboarding} onClose={() => setShowOnboarding(false)} />

            {/* Астронавт показывается только где нужно */}
            {/* {user && <AstronautGuide />}*/}
        </div>
    );
}