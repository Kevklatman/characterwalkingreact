// src/utils/mapUtils.js
import { MAPS } from '../config/maps';

export const checkMapTransition = (x, y, currentMap) => {
  const mapConfig = MAPS[currentMap];
  
  if (!mapConfig || !mapConfig.transitions) return null;

  for (const [, transition] of Object.entries(mapConfig.transitions)) {
    const [doorX, doorY, width, height] = transition.rect;
    
    if (x >= doorX && x <= doorX + width && y >= doorY && y <= doorY + height) {
      const destinationMap = transition.destination.map;
      const spawnPoint = transition.destination.spawnPoint;
      
      return {
        newMap: destinationMap,
        newPosition: MAPS[destinationMap].spawnPoints[spawnPoint],
        spawnPoint
      };
    }
  }
  
  return null;
};