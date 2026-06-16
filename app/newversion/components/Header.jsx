import React from 'react';

export default function Header({ onMenuOpen, darkMode, onToggleDark }) {
  return (
    <header className="app-header">
      <div onClick={onMenuOpen} style={{ cursor: 'pointer' }}>
        <i className="fas fa-bars-staggered fa-lg"></i>
      </div>
      <h1 className="brand-name">आजको समाचार</h1>
      <div onClick={onToggleDark} style={{ cursor: 'pointer' }}>
        <i id="darkModeIcon" className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'} fa-lg`}></i>
      </div>
    </header>
  );
}
