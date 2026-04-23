import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    setErr(''); setBusy(true);
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
    <div className="panel" style={{ maxWidth: 460, margin: '40px auto' }}>
      <h2 className="panel-title">Вход</h2>
      <form className="form" onSubmit={submit}>
        <label>Email
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </label>
        <label>Пароль
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </label>
        {err && <div className="error">{err}</div>}
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? 'Входим...' : 'Войти'}
        </button>
      </form>
      <p style={{ marginTop: 16, color: 'var(--muted)' }}>
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </p>
    </div>
  );
}