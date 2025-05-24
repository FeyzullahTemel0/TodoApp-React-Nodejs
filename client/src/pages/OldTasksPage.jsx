// client/src/pages/OldTasksPage.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './Tasks.css';

function OldTasksPage() {
  const [oldTasks, setOldTasks] = useState([]);

  useEffect(() => {
    api.get('/tasks/deleted').then(res => setOldTasks(res.data)).catch(console.error);
  }, []);

  const restore = id => {
    api.put(`/tasks/${id}`, { action: 'restore' }).then(() => {
      setOldTasks(prev => prev.filter(t => t.id !== id));
    }).catch(console.error);
  };

  return (
    <div className="tasks-container">
      <h2>Silinen Görevler</h2>
      <ul>
        {oldTasks.map(t => (
          <li key={t.id}>
            {t.title} <button onClick={()=>restore(t.id)}>Geri Yükle</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OldTasksPage;
