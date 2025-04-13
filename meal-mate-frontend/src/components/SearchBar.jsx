import React, { useState, useEffect } from 'react';
import './SearchBar.css';

export default function SearchBar({ onSearch }) {
  const [inputValue, setInputValue] = useState('');
  const [showClear, setShowClear] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(inputValue);
      setShowClear(inputValue.length > 0);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [inputValue, onSearch]);

  const handleClear = () => {
    setInputValue('');
    onSearch('');
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search recipes..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="search-bar"
      />
      {showClear && (
        <button 
          className="clear-search-btn"
          onClick={handleClear}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}
