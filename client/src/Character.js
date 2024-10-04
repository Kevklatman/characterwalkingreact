import React, { useState, useEffect } from 'react';
import './index.css';

const Character = ({ mapRef }) => {
  const [posX, setPosX] = useState(376);
  const [posY, setPosY] = useState(300);
  const [direction, setDirection] = useState('down');

  useEffect(() => {
    const handleKeyDown = async (event) => {
      if (!mapRef.current) return;

      let newDirection = direction;
      let newPosX = posX;
      let newPosY = posY;

      switch (event.key) {
        case 'ArrowUp':
          newDirection = 'up';
          newPosY -= 16; // Adjust the value for movement speed
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
          setPosX(data.x);
          setPosY(data.y);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mapRef, posX, posY, direction]);

  return (
    <div
      className={`character facing-${direction}`}
      style={{
        left: posX + 'px',
        top: posY + 'px',
      }}
    ></div>
  );
};

export default Character;
