// client/src/pages/TodoPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './TodoPage.css';
import TodoItem from '../components/TodoItem';
import FilterBar from '../components/FilterBar';

function TodoPage() {
  const [todos, setTodos]     = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [newTime, setNewTime] = useState('');
  const [filter, setFilter]   = useState('all');
  const [alerts, setAlerts]   = useState([]);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, 60000);
    return () => clearInterval(timer);
  }, []);

  const refresh = async () => {
    const data = await fetchTodos();
    checkReminders(data);
    setTodos(processOverdue(data));
  };

  const fetchTodos = async () => {
    try {
      const res = await api.get('/tasks');
      return res.data;
    } catch (e) {
      console.error('Veri alınamadı:', e);
      return [];
    }
  };

  const checkReminders = list => {
    const now = new Date().toTimeString().slice(0,5);
    list.forEach(t => {
      if (t.time === now && t.completed === 0 && !alerts.includes(t.id)) {
        setAlerts(prev => [...prev, t.id]);
        setTimeout(() => setAlerts(prev => prev.filter(i => i !== t.id)), 5000);
      }
    });
  };

  const processOverdue = list => {
    const now = new Date();
    return list.map(t => {
      if (!t.completed && t.time) {
        const [h, m] = t.time.split(':').map(Number);
        const due = new Date(now);
        due.setHours(h, m, 0, 0);
        const diffH = (now - due) / (1000*60*60);
        return { ...t, overdue: diffH > 2 };
      }
      return { ...t, overdue: false };
    });
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      await api.post('/tasks', { title: newTodo, time: newTime });
      setNewTodo(''); setNewTime('');
      refresh();
    } catch (e) {
      console.error('Ekleme hatası:', e);
    }
  };

  const updateTodo = async (id, title, completed, time) => {
    try {
      await api.put(`/tasks/${id}`, { title, completed, time });
      refresh();
    } catch (e) {
      console.error('Güncelleme hatası:', e);
    }
  };

  const deleteTodo = async id => {
    try {
      await api.delete(`/tasks/${id}`);
      refresh();
    } catch (e) {
      console.error('Silme hatası:', e);
    }
  };

  const displayed = todos.filter(t => {
    if (filter === 'active')    return t.completed === 0;
    if (filter === 'completed') return t.completed === 1;
    return t.deleted === 0;
  });

  return (
    <div className="todo-page">
      <header className="todo-header">
        <Link to="/profile" className="profile-link">👤</Link>
      </header>

      {alerts.map(id => {
        const t = todos.find(x => x.id === id);
        return (<div key={id} className="alert">⏰ {t.title} zamanı geldi!</div>);
      })}

      <div className="todo-container">
        <h1 className="title">📝 Todo Uygulaması</h1>
        <div className="todo-form">
          <input type="text" placeholder="Yeni görev..." value={newTodo} onChange={e=>setNewTodo(e.target.value)} />
          <input type="time" value={newTime} onChange={e=>setNewTime(e.target.value)} />
          <button onClick={addTodo}>Ekle</button>
        </div>

        <FilterBar filter={filter} setFilter={setFilter} />

        <ul className="todo-list">
          {displayed.map(todo => (
            <TodoItem key={todo.id} todo={todo} onUpdate={updateTodo} onDelete={deleteTodo} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TodoPage;
