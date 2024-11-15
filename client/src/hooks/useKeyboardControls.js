// src/hooks/useKeyboardControls.js
import { useEffect } from 'react';
import { useCharacterMovement } from '../useCharacterMovement';
export const useKeyboardControls = () => {
  const { move } = useCharacterMovement();

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowUp':
          move('up');
          break;
        case 'ArrowDown':
          move('down');
          break;
        case 'ArrowLeft':
          move('left');
          break;
        case 'ArrowRight':
          move('right');
          break;
        default:
          return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);
};