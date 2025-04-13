import React, { useState } from 'react';
import './MealDropTarget.css';

export default function MealDropTarget({ day, onDrop }) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const meal = e.dataTransfer.getData('text/plain');
    onDrop(day, meal);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <div 
      className={`drop-target ${isDragOver ? 'drag-over' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDragExit={handleDragLeave}
    >
      <div className="drop-content">
        {isDragOver ? 'Release to add meal' : 'Drop meals here'}
      </div>
    </div>
  );
}
