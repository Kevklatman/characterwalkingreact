// src/hooks/useCharacterMovement.js
import { useState, useCallback } from 'react';
import { characterApi } from '../services/api/characterApi';
import { useGame } from '../contexts/GameContext';
import { GAME_CONSTANTS } from '../config/constants';
import { checkMapTransition } from '../utils/mapUtils';

export const useCharacterMovement = () => {
  const { playerPosition, setPlayerPosition, currentMap, setCurrentMap } = useGame();
  const [direction, setDirection] = useState('down');
  const [isMoving, setIsMoving] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleMapTransition = useCallback(async (transitionData) => {
    setIsTransitioning(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Transition animation
    
    setPlayerPosition(transitionData.newPosition);
    setCurrentMap(transitionData.newMap);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    setIsTransitioning(false);
  }, [setPlayerPosition, setCurrentMap]);

  const move = useCallback(async (newDirection) => {
    if (isTransitioning) return;

    let newX = playerPosition.x;
    let newY = playerPosition.y;

    switch (newDirection) {
      case 'up':
        newY -= GAME_CONSTANTS.MOVEMENT_SPEED;
        break;
      case 'down':
        newY += GAME_CONSTANTS.MOVEMENT_SPEED;
        break;
      case 'left':
        newX -= GAME_CONSTANTS.MOVEMENT_SPEED;
        break;
      case 'right':
        newX += GAME_CONSTANTS.MOVEMENT_SPEED;
        break;
      default:
        return;
    }

    try {
      const response = await characterApi.move(newX, newY, newDirection);
      
      if (!response.collision) {
        setDirection(newDirection);
        setIsMoving(true);
        setPlayerPosition({ x: newX, y: newY });

        const transitionData = checkMapTransition(newX, newY, currentMap);
        if (transitionData) {
          await handleMapTransition(transitionData);
        }
      }
    } catch (error) {
      console.error('Movement error:', error);
    }
  }, [playerPosition, currentMap, isTransitioning, handleMapTransition]);

  return {
    position: playerPosition,
    direction,
    isMoving,
    isTransitioning,
    move
  };
};