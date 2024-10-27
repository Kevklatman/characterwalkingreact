// Map.js
import React, { forwardRef, useState, useEffect } from 'react';
import AICharacter from './AICharacter';

const Map = forwardRef(({ children, backgroundImage }, ref) => {
  const [aiCharacters, setAICharacters] = useState([]);

  useEffect(() => {
    const updateAICharacters = async () => {
      try {
        const response = await fetch('http://localhost:5000/ai-characters');
        if (!response.ok) throw new Error('Failed to fetch AI characters');
        const characters = await response.json();
        setAICharacters(characters);
      } catch (error) {
        console.error('Error fetching AI characters:', error);
      }
    };

    const interval = setInterval(updateAICharacters, 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="map" 
      ref={ref}
      style={{
        backgroundImage: `url(${backgroundImage})`
      }}
    >
      {aiCharacters.map(char => (
        <AICharacter
          key={char.id}
          id={char.id}
          x={char.x}
          y={char.y}
          direction={char.direction}
          characterType={char.characterType}
          isMoving={char.isMoving}
        />
      ))}
      {children}
    </div>
  );
});

export default Map;