// client/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/auth';
import './Auth.css';
export default function LoginPage() {
  const [n, u] = useState(''); const [p, sp] = useState(''); const [e, se] = useState(); const nav = useNavigate();
  const s = async ev => { ev.preventDefault(); try { await login(n, p); nav('/'); } catch { se('Giriş hatalı'); } };
  return (
    <div className="auth-container">
      <h2>Giriş Yap</h2>
      <form onSubmit={s} className="auth-form">
        <input value={n} onChange={e => u(e.target.value)} placeholder="Kullanıcı Adı" required />
        <input type="password" value={p} onChange={e => sp(e.target.value)} placeholder="Şifre" required />
        <button type="submit">Giriş</button>
        {e && <p className="error">{e}</p>}
      </form>
      <p>Hesap yok? <Link to="/register">Kayıt Ol</Link></p>
    </div>
  );
}