// client/src/components/FilterBar.jsx
import React from 'react';
import './FilterBar.css';

function FilterBar({ filter, setFilter }) {
  const buttons = [
    { label: 'Tümü', value: 'all' },
    { label: 'Aktif', value: 'active' },
    { label: 'Tamamlanan', value: 'completed' },
  ];

  return (
    <div className="filter-bar">
      {buttons.map((btn) => (
        <button
          key={btn.value}
          onClick={() => setFilter(btn.value)}
          className={filter === btn.value ? 'active' : ''}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;
