// client/src/components/TodoItem.jsx
import React, { useState } from 'react';
import './TodoItem.css';

function TodoItem({ todo, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle]     = useState(todo.title);
  const [time, setTime]       = useState(todo.time);

  const toggleDone = () => onUpdate(todo.id, todo.title, todo.completed ? 0 : 1, todo.time);

  const saveEdit = () => {
    onUpdate(todo.id, title, todo.completed, time);
    setIsEditing(false);
  };

  const classes = [
    'todo-item-card',
    todo.completed ? 'completed' : '',
    todo.overdue   ? 'overdue'   : ''
  ].join(' ');

  return (
    <li className={classes}>
      <div className="todo-left">
        <input type="checkbox" checked={!!todo.completed} onChange={toggleDone}/>
        {isEditing ? (
          <>
            <input
              className="edit-input"
              value={title} onChange={e=>setTitle(e.target.value)}
              onBlur={saveEdit} onKeyDown={e=>e.key==='Enter'&&saveEdit()}
            />
            <input
              className="edit-time"
              type="time"
              value={time} onChange={e=>setTime(e.target.value)}
            />
          </>
        ) : (
          <div className="todo-text" onClick={()=>setIsEditing(true)}>
            <span>{todo.title}</span>
            {todo.time && <small className="todo-time">⏰ {todo.time}</small>}
          </div>
        )}
      </div>
      <div className="todo-actions">
        <button className="edit-button" onClick={()=>setIsEditing(true)}>Güncelle</button>
        <button className="delete-button" onClick={()=>onDelete(todo.id)}>Sil</button>
      </div>
    </li>
  );
}

export default TodoItem;
