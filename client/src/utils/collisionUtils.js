// src/utils/collisionUtils.js
import { GAME_CONSTANTS } from '../config/constants';

export const checkCollision = (x, y, currentMap, pathSegments) => {
  const characterCenter = {
    x: x + GAME_CONSTANTS.CHARACTER_SIZE.WIDTH / 2,
    y: y + GAME_CONSTANTS.CHARACTER_SIZE.HEIGHT / 2
  };

  // Check map boundaries
  if (x < 0 || 
      y < 0 || 
      x + GAME_CONSTANTS.CHARACTER_SIZE.WIDTH > GAME_CONSTANTS.MAP_DIMENSIONS.WIDTH ||
      y + GAME_CONSTANTS.CHARACTER_SIZE.HEIGHT > GAME_CONSTANTS.MAP_DIMENSIONS.HEIGHT) {
    return true;
  }

  // Check if point is on valid path
  for (const [startX, startY, endX, endY, width] of pathSegments) {
    const distance = pointLineDistance(
      characterCenter.x,
      characterCenter.y,
      startX,
      startY,
      endX,
      endY
    );
    
    if (distance <= width / 2) {
      return false;
    }
  }

  return true;
};

export const pointLineDistance = (x, y, x1, y1, x2, y2) => {
  const A = x - x1;
  const B = y - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  const param = lenSq !== 0 ? dot / lenSq : -1;

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = x - xx;
  const dy = y - yy;

  return Math.sqrt(dx * dx + dy * dy);
};