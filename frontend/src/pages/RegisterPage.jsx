import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const on = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      await register(form.email, form.username, form.password);
      setSubmitted(true);
    } catch (e) {
      setErr(e.message || 'Ошибка регистрации');
    } finally {
      setBusy(false);
    }
  };

  if (submitted) {
    return (
      <div className="panel" style={{ maxWidth: 460, margin: '40px auto' }}>
        <h2 className="panel-title">Заявка отправлена</h2>
        <p>
          Спасибо за регистрацию! Ваш аккаунт ожидает одобрения администратора.
          После подтверждения вы сможете войти, используя свой email и пароль.
        </p>
        <p style={{ marginTop: 16 }}>
          <Link to="/login" className="btn btn-primary">К странице входа</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="panel" style={{ maxWidth: 460, margin: '40px auto' }}>
      <h2 className="panel-title">Регистрация</h2>
      <form className="form" onSubmit={submit}>
        <label>Email
          <input type="email" value={form.email} onChange={on('email')} required />
        </label>
        <label>Имя пользователя
          <input value={form.username} onChange={on('username')} minLength={2} required />
        </label>
        <label>Пароль (минимум 8 символов)
          <input type="password" value={form.password} onChange={on('password')} minLength={8} required />
        </label>
        {err && <div className="error">{err}</div>}
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? 'Создаём...' : 'Зарегистрироваться'}
        </button>
      </form>
      <p style={{ marginTop: 12, color: 'var(--muted)', fontSize: 13 }}>
        После регистрации аккаунт нужно подтвердить администратору — войти можно будет только после одобрения.
      </p>
      <p style={{ marginTop: 16, color: 'var(--muted)' }}>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </div>
  );
}