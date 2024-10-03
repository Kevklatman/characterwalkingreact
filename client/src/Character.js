// Character.js
import React, { useState, useEffect } from 'react';
import './index.css';

const Character = ({ mapRef }) => {
  const [posX, setPosX] = useState(376);
  const [posY, setPosY] = useState(276);
  const [direction, setDirection] = useState('down');
  const [walking, setWalking] = useState(false);

  useEffect(() => {
    const handleKeyDown = async (event) => {
      if (!mapRef.current) return;

      let newDirection;
      switch (event.key) {
        case 'ArrowUp':
          newDirection = 'up';
          break;
        case 'ArrowDown':
          newDirection = 'down';
          break;
        case 'ArrowLeft':
          newDirection = 'left';
          break;
        case 'ArrowRight':
          newDirection = 'right';
          break;
        default:
          return;
      }

      setDirection(newDirection);
      setWalking(true);

      try {
        const response = await fetch('http://localhost:5000/move', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            x: posX,
            y: posY,
            direction: newDirection,
          }),
        });

        const data = await response.json();
        setPosX(data.x);
        setPosY(data.y);
        setWalking(data.walking);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const handleKeyUp = async () => {
      setWalking(false);
      try {
        await fetch('http://localhost:5000/stop', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            x: posX,
            y: posY,
          }),
        });
      } catch (error) {
        console.error('Error:', error);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [mapRef, posX, posY]);

  return (
    <div
      className={`character ${walking ? 'walking' : ''} facing-${direction}`}
      style={{
        left: posX + 'px',
        top: posY + 'px',
      }}
    ></div>
  );
};

export default Character;