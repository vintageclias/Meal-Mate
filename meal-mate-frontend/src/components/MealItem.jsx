import React, { useState } from 'react';
import './MealItem.css';

export default function MealItem({ name, onDrop }) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div 
      className={`meal-item ${isDragging ? 'dragging' : ''}`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', name);
        setIsDragging(true);
        e.dataTransfer.setDragImage(e.target, 0, 0);
      }}
      onDragEnd={() => setIsDragging(false)}
    >
      <span className="meal-name">{name}</span>
      <button 
        className="remove-btn"
        onClick={() => onDrop(name)}
        aria-label={`Remove ${name}`}
      >
        ×
      </button>
    </div>
  );
}
