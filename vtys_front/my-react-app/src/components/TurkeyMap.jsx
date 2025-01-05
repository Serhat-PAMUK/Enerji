import React, { useState } from 'react';
import { turkeyMapData } from '../data/turkeyMapData';

const TurkeyMap = ({ data, onHover, onClick }) => {
  const [hoveredCityName, setHoveredCityName] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const getColor = (value) => {
    if (value === 0) return '#ffffff'; // 0 olunca beyaz göster
    if (value < 100) return 'rgba(var(--energy-color-rgb), 0.1)'; // 100'den azsa daha açık
    if (value < 300) return 'rgba(var(--energy-color-rgb), 0.3)'; // 100-300 arası biraz daha koyu
    if (value < 600) return 'rgba(var(--energy-color-rgb), 0.5)'; // 300-600 arası biraz daha koyu
    if (value < 1000) return 'rgba(var(--energy-color-rgb), 0.7)'; // 600-1000 arası biraz daha koyu
    return 'rgba(var(--energy-color-rgb), 1)'; // 1000'den fazla ise daha koyu
  };

  // Şehir verilerini kontrol et ve haritada göster
  const getCityColor = (cityName) => {
    const cityData = data?.find(item => 
      item.il.toLowerCase() === cityName.toLowerCase()
    );
    return getColor(cityData?.kuruluGuc || 0);
  };

  const handleMouseMove = (event) => {
    const svgRect = event.currentTarget.getBoundingClientRect();
    setMousePosition({ x: event.clientX - svgRect.left, y: event.clientY - svgRect.top });
  };

  return (
    <div onMouseMove={handleMouseMove} style={{ position: 'relative' }}>
      <svg
        viewBox="0 0 1007.478 527.323"
        className="turkey-map"
      >
        {turkeyMapData.map((city) => (
          <path
            key={city.id}
            id={city.id}
            d={city.path}
            fill={getCityColor(city.name)}
            onMouseEnter={() => {
              onHover(city.name);
              setHoveredCityName(city.name);
            }}
            onMouseLeave={() => setHoveredCityName(null)}
            onClick={() => onClick(city.name)}
          />
        ))}
      </svg>
      {hoveredCityName && (
        <div
          style={{
            position: 'absolute',
            top: mousePosition.y + 15,
            left: mousePosition.x + 15,
            backgroundColor: 'white',
            padding: '5px',
            borderRadius: '4px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            pointerEvents: 'none',
            zIndex: 1000,
          }}
        >
          {hoveredCityName}
        </div>
      )}
    </div>
  );
};

export default TurkeyMap; 