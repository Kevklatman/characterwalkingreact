// src/contexts/GameContext.js
import React, { createContext, useContext, useState } from 'react';
import { MAPS } from '../config/maps';

const GameContext = createContext(null);

export const GameProvider = ({ children }) => {
  const [currentMap, setCurrentMap] = useState('outside');
  const [playerPosition, setPlayerPosition] = useState(MAPS.outside.spawnPoints.default);
  const [isLoading, setIsLoading] = useState(true);
  const [gameState, setGameState] = useState('playing');

  const value = {
    currentMap,
    setCurrentMap,
    playerPosition,
    setPlayerPosition,
    isLoading,
    setIsLoading,
    gameState,
    setGameState
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};