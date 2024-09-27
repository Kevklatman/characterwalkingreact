import React, { useState, useEffect } from 'react';
import './index.css';

const Character = () => {
  const [posX, setPosX] = useState(144);
  const [posY, setPosY] = useState(144);
  const [direction, setDirection] = useState('down');
  const [walking, setWalking] = useState(false);
  const [mapWidth, setMapWidth] = useState(window.innerWidth);
  const [mapHeight, setMapHeight] = useState(window.innerHeight);
  const speed = 9;

  useEffect(() => {
    const handleResize = () => {
      setMapWidth(window.innerWidth);
      setMapHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      setWalking(true);

      switch (event.key) {
        case 'ArrowUp':
          setPosY((prevPosY) => Math.max(prevPosY - speed, 0));
          setDirection('up');
          break;
        case 'ArrowDown':
          setPosY((prevPosY) => Math.min(prevPosY + speed, mapHeight - 48));
          setDirection('down');
          break;
        case 'ArrowLeft':
          setPosX((prevPosX) => Math.max(prevPosX - speed, 0));
          setDirection('left');
          break;
        case 'ArrowRight':
          setPosX((prevPosX) => Math.min(prevPosX + speed, mapWidth - 48));
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
  }, [speed, mapWidth, mapHeight]);

  return (
    <div
      className={`character ${walking ? 'walking' : ''} facing-${direction}`}
      style={{
        top: posY + 'px',
        left: posX + 'px',
      }}
    ></div>
  );
};

export default Character;