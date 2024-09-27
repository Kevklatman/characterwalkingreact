// Character.js
import React, { useState, useEffect } from 'react';
import './index.css';

const Character = ({ mapRef }) => {
  const [posX, setPosX] = useState(376);
  const [posY, setPosY] = useState(276);
  const [direction, setDirection] = useState('down');
  const [walking, setWalking] = useState(false);
  const speed = 9;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!mapRef.current) return;

      setWalking(true);

      const mapRect = mapRef.current.getBoundingClientRect();
      const characterWidth = 48;
      const characterHeight = 48;
      const mapWidth = mapRect.width;
      const mapHeight = mapRect.height;

      switch (event.key) {
        case 'ArrowUp':
          setPosY((prevPosY) => Math.max(prevPosY - speed, 0));
          setDirection('up');
          break;
        case 'ArrowDown':
          setPosY((prevPosY) =>
            Math.min(prevPosY + speed, mapHeight - characterHeight)
          );
          setDirection('down');
          break;
        case 'ArrowLeft':
          setPosX((prevPosX) => Math.max(prevPosX - speed, 0));
          setDirection('left');
          break;
        case 'ArrowRight':
          setPosX((prevPosX) =>
            Math.min(prevPosX + speed, mapWidth - characterWidth)
          );
          setDirection('right');
          break;
        default:
          break;
      }
    };

    const handleKeyUp = () => {
      setWalking(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [mapRef, speed]);

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