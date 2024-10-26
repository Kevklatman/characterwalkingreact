import React, { useState, useEffect } from 'react';

const AICharacter = ({ startX, startY, pathSegments, characterType }) => {
  const [posX, setPosX] = useState(startX);
  const [posY, setPosY] = useState(startY);
  const [direction, setDirection] = useState('down');
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [moving, setMoving] = useState(true);

  const SPEED = 1;

  useEffect(() => {
    const moveInterval = setInterval(() => {
      if (!moving) return;

      const currentPath = pathSegments[currentPathIndex];
      const [startX, startY, endX, endY] = currentPath;

      // Calculate direction
      const dx = endX - startX;
      const dy = endY - startY;
      
      // Update character direction
      if (Math.abs(dx) > Math.abs(dy)) {
        setDirection(dx > 0 ? 'right' : 'left');
      } else {
        setDirection(dy > 0 ? 'down' : 'up');
      }

      // Calculate new position
      const totalDistance = Math.sqrt(dx * dx + dy * dy);
      const newProgress = Math.min(progress + SPEED, totalDistance);
      
      const ratio = newProgress / totalDistance;
      const newX = startX + dx * ratio;
      const newY = startY + dy * ratio;
      
      setPosX(newX);
      setPosY(newY);
      setProgress(newProgress);

      // Check if we reached the end of current path segment
      if (newProgress >= totalDistance) {
        setProgress(0);
        setCurrentPathIndex((prev) => (prev + 1) % pathSegments.length);
        
        // Add random pauses
        if (Math.random() < 0.2) { // 20% chance to pause
          setMoving(false);
          setTimeout(() => setMoving(true), Math.random() * 2000 + 1000); // Pause for 1-3 seconds
        }
      }
    }, 50);

    return () => clearInterval(moveInterval);
  }, [currentPathIndex, progress, moving, pathSegments]);

  return (
    <div
      className={`character facing-${direction} ${characterType}`}
      style={{
        left: `${posX}px`,
        top: `${posY}px`,
      }}
    />
  );
};

export default AICharacter;