// src/components/game/AICharacter.js
import React from 'react';

const AICharacter = ({ id, x, y, direction, characterType, isMoving }) => {
  return (
    <div
      className={`
        character
        ${characterType}
        facing-${direction}
        ${isMoving ? 'walking' : ''}
      `}
      style={{
        left: `${x}px`,
        top: `${y}px`
      }}
    />
  );
};

export default AICharacter;
