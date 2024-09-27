import React, { useState, useEffect } from 'react';

const Character = () => {
  const [posX, setPosX] = useState(144);
  const [posY, setPosY] = useState(144);
  const [direction, setDirection] = useState('down');
  const [walking, setWalking] = useState(false);
  const speed = 9;

  useEffect(() => {
    const handleKeyDown = (event) => {
      setWalking(true);

      switch (event.key) {
        case 'ArrowUp':
          setPosY(Math.max(posY - speed, 0));
          setDirection('up');
          break;
        case 'ArrowDown':
          setPosY(Math.min(posY + speed, 288));
          setDirection('down');
          break;
        case 'ArrowLeft':
          setPosX(Math.max(posX - speed, 0));
          setDirection('left');
          break;
        case 'ArrowRight':
          setPosX(Math.min(posX + speed, 288));
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
  }, [posX, posY]);

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