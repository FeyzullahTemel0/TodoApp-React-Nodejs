// client/src/pages/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { logout } from '../services/auth';
import './Profile.css';

function ProfilePage() {
  const nav = useNavigate();
  const [tab, setTab]         = useState('info');
  // Removed unused 'profile' state
  const [data, setData]       = useState({ email:'', phone:'', city:'', district:'', address:'', recovery_email:'' });
  const [pwd, setPwd]         = useState({ old:'', new:'', confirm:'' });
  const [canChange, setCanChange] = useState(true);

  useEffect(() => { fetchProfile(); }, []);
  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile');
      setData(res.data);
      if (res.data.last_password_change) {
        const diff = (Date.now() - new Date(res.data.last_password_change)) / (1000*60*60*24);
        setCanChange(diff>=7);
      }
    } catch (e) { console.error(e); }
  };

  const saveProfile = () => {
    api.put('/profile', data).then(fetchProfile).catch(console.error);
  };

  const changePwd = () => {
    if (pwd.new!==pwd.confirm) return alert('Şifreler uyuşmuyor');
    api.put('/profile/password', { oldPassword:pwd.old,newPassword:pwd.new })
      .then(()=>{ setPwd({old:'',new:'',confirm:''}); setCanChange(false); })
      .catch(console.error);
  };

  const doLogout = () => { logout(); nav('/login'); };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <button onClick={doLogout} className="logout-btn">Çıkış Yap</button>
      </div>
      <div className="profile-body">
        <nav className="profile-nav">
          <button className={tab==='info'?'active':''} onClick={()=>setTab('info')}>Profil Bilgilerim</button>
          <button className={tab==='lists'?'active':''} onClick={()=>setTab('lists')}>Görev Listelerim</button>
          <button className={tab==='deleted'?'active':''} onClick={()=>setTab('deleted')}>Silinen Görevler</button>
        </nav>
        <div className="profile-content">
          {tab==='info' && (
            <>
              <h3>Profil Bilgileri</h3>
              <input value={data.email} onChange={e=>setData(d=>({...d,email:e.target.value}))} placeholder="Email" />
              <input value={data.phone} onChange={e=>setData(d=>({...d,phone:e.target.value}))} placeholder="Telefon" />
              <input value={data.city} onChange={e=>setData(d=>({...d,city:e.target.value}))} placeholder="Şehir" />
              <input value={data.district} onChange={e=>setData(d=>({...d,district:e.target.value}))} placeholder="İlçe" />
              <input value={data.address} onChange={e=>setData(d=>({...d,address:e.target.value}))} placeholder="Adres" />
              <input value={data.recovery_email} onChange={e=>setData(d=>({...d,recovery_email:e.target.value}))} placeholder="Yedek Email" />
              <button onClick={saveProfile}>Kaydet</button>
              <h3>Şifre Değiştir</h3>
              <input type="password" value={pwd.old} onChange={e=>setPwd(p=>({...p,old:e.target.value}))} placeholder="Eski Şifre" />
              <input type="password" value={pwd.new} onChange={e=>setPwd(p=>({...p,new:e.target.value}))} placeholder="Yeni Şifre" disabled={!canChange} />
              <input type="password" value={pwd.confirm} onChange={e=>setPwd(p=>({...p,confirm:e.target.value}))} placeholder="Yeni Şifre Tekrar" disabled={!canChange} />
              <button onClick={changePwd} disabled={!canChange}>Güncelle</button>
            </>
          )}
          {tab==='lists' && <ListsPage />}
          {tab==='deleted' && <OldTasksPage />}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;