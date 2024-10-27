// Character.js
import React, { useState, useEffect } from 'react';
import { checkTransitionPoint } from './MapTransition';
import './index.css';

const Character = ({ mapRef, currentMap, onMapTransition }) => {
  const [posX, setPosX] = useState(376);
  const [posY, setPosY] = useState(300);
  const [direction, setDirection] = useState('down');
  const [isTransitioning, setIsTransitioning] = useState(false);

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

          // Check for map transition points
          const destination = checkTransitionPoint(newPosX, newPosY, currentMap);
          if (destination) {
            handleMapTransition(destination);
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

  const handleMapTransition = async (destination) => {
    setIsTransitioning(true);
    
    // Add transition animation class
    const characterElement = document.querySelector('.character');
    characterElement.classList.add('transitioning');
    
    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update position and map
    setPosX(destination.x);
    setPosY(destination.y);
    setDirection(destination.facing);
    onMapTransition(destination.mapName);
    
    // Remove transition animation
    characterElement.classList.remove('transitioning');
    setIsTransitioning(false);
  };

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