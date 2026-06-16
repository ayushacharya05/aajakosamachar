import React, { useState, useEffect } from 'react';

export default function CarouselSection({ items, onSelect }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Simple auto-play effect logic mimicking bootstrap
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [items.length]);

  return (
    <div id="newsCarousel" className="carousel slide" style={{ display: 'block' }}>
      <div className="carousel-inner">
        {items.map((item, idx) => {
          const imageUrl = item.thumbnail || item.enclosure?.link || item.description?.match(/<img[^>]+src="([^">]+)"/)?.[1];
          return (
            <div 
              key={idx} 
              className={`carousel-item ${idx === activeIndex ? 'active' : ''}`} 
              onClick={() => onSelect(item)}
            >
              <img src={imageUrl} alt="" />
              <div className="carousel-caption">
                <h5>{item.title}</h5>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
