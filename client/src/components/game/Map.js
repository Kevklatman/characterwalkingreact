// src/components/game/Map.js
import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { useAICharacters } from '../../hooks/useAICharacters';
import { MAPS } from '../../config/maps';
import AICharacter from './AICharacter';

const Map = ({ children }) => {
  const { currentMap } = useGame();
  const aiCharacters = useAICharacters();
  
  return (
    <div 
      className="map"
      style={{
        backgroundImage: `url(${MAPS[currentMap].backgroundImage})`
      }}
    >
      {aiCharacters.map(char => (
        <AICharacter
          key={char.id}
          {...char}
        />
      ))}
      {children}
    </div>
  );
};

export default Map;