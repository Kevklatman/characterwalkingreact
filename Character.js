import React, { useState, useEffect } from 'react';

const Character = () => {
  const [posX, setPosX] = useState(144);
  const [posY, setPosY] = useState(144);
  const speed = 9;

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowUp':
          setPosY(Math.max(posY - speed, 0));
          break;
        case 'ArrowDown':
          setPosY(Math.min(posY + speed, 288));
          break;
        case 'ArrowLeft':
          setPosX(Math.max(posX - speed, 0));
          break;
        case 'ArrowRight':
          setPosX(Math.min(posX + speed, 288));
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [posX, posY]);

  return (
    <div
      className="character"
      style={{
        top: posY + 'px',
        left: posX + 'px',
      }}
    ></div>
  );
};

export default Character;