// client/src/pages/ListsPage.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './Tasks.css';

function ListsPage() {
  const [lists, setLists] = useState([]);
  const [name, setName]   = useState('');

  useEffect(() => {
    api.get('/lists').then(res => setLists(res.data)).catch(console.error);
  }, []);

  const create = () => {
    api.post('/lists', { name, items: [] }).then(res => {
      setLists(prev => [...prev, { id: res.data.id, name }]);
      setName('');
    }).catch(console.error);
  };

  const apply = id => {
    api.post(`/lists/${id}/apply`).then(() => window.location = '/').catch(console.error);
  };

  return (
    <div className="tasks-container">
      <h2>Sık Yapılan Listeler</h2>
      <div className="list-create">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Liste Adı" />
        <button onClick={create}>Oluştur</button>
      </div>
      <ul>
        {lists.map(l => (
          <li key={l.id} onClick={()=>apply(l.id)}>{l.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default ListsPage;
