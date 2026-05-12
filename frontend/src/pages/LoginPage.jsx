import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState('');
    const [busy, setBusy] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setErr('');
        setBusy(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (e) {
            setErr(e.message || 'Ошибка входа');
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="login-wrapper">
            <form className="space-form" onSubmit={submit}>
                <section className="bg-stars">
                    <span className="star" />
                    <span className="star" />
                    <span className="star" />
                    <span className="star" />
                </section>
                <div className="form-title">
                    <span>Войти в измерение</span>
                </div>
                <div className="title-2">
                    <span>JAVASCRIPT</span>
                </div>

                <div className="input-container">
                    <input
                        type="email"
                        placeholder="Email"
                        className="input-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="input-container">
                    <input
                        type="password"
                        placeholder="Password"
                        className="input-pwd"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {err && <div className="form-error">{err}</div>}

                <button type="submit" className="submit" disabled={busy}>
          <span className="sign-text">
            {busy ? 'ВХОДИМ...' : 'ВОЙТИ'}
          </span>
                </button>

                <p className="signup-link">
                    Нет аккаунта?
                    <span className="up" style={{ cursor: 'default' }}>
            Обратитесь к преподавателю
          </span>
                </p>
            </form>
        </div>
    );
}