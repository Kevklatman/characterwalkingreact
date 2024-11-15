// src/components/game/Character.js
import React from 'react';
import { useKeyboardControls } from '../../hooks/useKeyboardControls';
import { useCharacterMovement } from '../../hooks/UseCharacterMovement';
const Character = () => {
  const { position, direction, isMoving, isTransitioning } = useCharacterMovement();
  useKeyboardControls();

  return (
    <div
      className={`
        character
        facing-${direction}
        ${isMoving ? 'walking' : ''}
        ${isTransitioning ? 'transitioning' : ''}
      `}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
    />
  );
};

export default Character;