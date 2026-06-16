import React from 'react';

export default function CategorySection({ onSelectTopic }) {
  const categories = [
    { id: 'All', label: 'सबै', icon: 'fas fa-th-large' },
    { id: 'Politics', label: 'राजनीति', icon: 'fas fa-landmark' },
    { id: 'Sports', label: 'खेलकुद', icon: 'fas fa-trophy' },
    { id: 'Tech', label: 'प्रविधि', icon: 'fas fa-microchip' },
    { id: 'Entertainment', label: 'मनोरञ्जन', icon: 'fas fa-film' },
    { id: 'Economy', label: 'अर्थतन्त्र', icon: 'fas fa-chart-line' },
  ];

  return (
    <div id="categorySection" style={{ display: 'grid' }}>
      {categories.map((cat) => (
        <div key={cat.id} className="cat-tile" onClick={() => onSelectTopic(cat.id)}>
          <i className={`${cat.icon} mb-2 text-primary fs-2`}></i>
          <br />
          <span>{cat.label}</span>
        </div>
      ))}
    </div>
  );
}
