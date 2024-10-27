import React, { useState, useEffect } from 'react';
import './index.css';

const Character = ({ mapRef, currentMap, onMapTransition, initialPosition }) => {
  const [posX, setPosX] = useState(initialPosition?.x || 376);
  const [posY, setPosY] = useState(initialPosition?.y || 300);
  const [direction, setDirection] = useState('down');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Reset position when initialPosition changes
  useEffect(() => {
    if (initialPosition) {
      setPosX(initialPosition.x);
      setPosY(initialPosition.y);
    }
  }, [initialPosition]);

  const checkMapTransition = (x, y) => {
    // Top of the screen transition
    if (y < 0) {
      if (currentMap === 'outside') {
        return {
          newMap: 'house',
          spawnPoint: 'fromOutside',
          newY: 400  // Appear at bottom of house
        };
      } else if (currentMap === 'house') {
        return {
          newMap: 'outside',
          spawnPoint: 'fromHouse',
          newY: 300  // Appear at middle of outside map
        };
      }
    }
    return null;
  };

  const handleMapTransition = async (transitionData) => {
    setIsTransitioning(true);
    
    // Fade out
    const characterElement = document.querySelector('.character');
    characterElement.classList.add('transitioning');
    
    // Wait for fade out animation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update position and map
    setPosX(posX);
    setPosY(transitionData.newY);
    onMapTransition(transitionData.newMap, transitionData.spawnPoint);
    
    // Wait a bit then fade back in
    await new Promise(resolve => setTimeout(resolve, 100));
    characterElement.classList.remove('transitioning');
    setIsTransitioning(false);
  };

  useEffect(() => {
    const handleKeyDown = async (event) => {
      if (!mapRef.current || isTransitioning) return;

      let newDirection = direction;
      let newPosX = posX;
      let newPosY = posY;

      switch (event.key) {
        case 'ArrowUp':
          newDirection = 'up';
          newPosY -= 16;
          break;
        case 'ArrowDown':
          newDirection = 'down';
          newPosY += 16;
          break;
        case 'ArrowLeft':
          newDirection = 'left';
          newPosX -= 16;
          break;
        case 'ArrowRight':
          newDirection = 'right';
          newPosX += 16;
          break;
        default:
          return;
      }

      setDirection(newDirection);

      try {
        const response = await fetch('http://localhost:5000/move', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            x: newPosX,
            y: newPosY,
            direction: newDirection,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!data.collision) {
          setPosX(newPosX);
          setPosY(newPosY);

          // Check for map transition
          const transitionData = checkMapTransition(newPosX, newPosY);
          if (transitionData) {
            handleMapTransition(transitionData);
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mapRef, posX, posY, direction, currentMap, isTransitioning]);

  return (
    <div
      className={`character facing-${direction} ${isTransitioning ? 'transitioning' : ''}`}
      style={{
        left: posX + 'px',
        top: posY + 'px',
      }}
    />
  );
};

export default Character;