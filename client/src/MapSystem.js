// MapSystem.js
import React, { useState } from 'react';
import Map from './Map';

const MAPS = {
  outside: {
    className: 'map-outside',
    spawnPoints: {
      default: { x: 376, y: 300 },
      fromHouse: { x: 380, y: 160 }
    }
  },
  house: {
    className: 'map-house',
    spawnPoints: {
      default: { x: 240, y: 400 },
      fromOutside: { x: 240, y: 420 }
    }
  }
};

export const MapProvider = ({ children }) => {
  const [currentMap, setCurrentMap] = useState('outside');
  const [spawnPoint, setSpawnPoint] = useState('default');

  const changeMap = (mapId, spawnPointId = 'default') => {
    setCurrentMap(mapId);
    setSpawnPoint(spawnPointId);
  };

  return (
    <div className={`game-map ${MAPS[currentMap].className}`}>
      <Map spawnPoint={MAPS[currentMap].spawnPoints[spawnPoint]}>
        {children}
      </Map>
    </div>
  );
};