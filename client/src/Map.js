// Map.js
import React, { forwardRef } from 'react';
import AICharacter from './AICharacter';

const Map = forwardRef(({ children }, ref) => {
  // Define different paths for NPCs
  const npcPaths = {
    shopkeeper: [
      [350, 170, 380, 170], // Shop entrance area
      [380, 170, 380, 150],
      [380, 150, 350, 150],
      [350, 150, 350, 170]
    ],
    wanderer: [
      [125, 230, 125, 310],
      [125, 310, 470, 310],
      [470, 310, 470, 230],
      [470, 230, 125, 230]
    ],
    trainer: [
      [200, 490, 200, 550],
      [200, 550, 290, 550],
      [290, 550, 290, 490],
      [290, 490, 200, 490]
    ]
  };

  return (
    <div className="map" ref={ref}>
      <AICharacter 
        startX={350} 
        startY={170} 
        pathSegments={npcPaths.shopkeeper}
        characterType="npc-1"
      />
      <AICharacter 
        startX={125} 
        startY={230} 
        pathSegments={npcPaths.wanderer}
        characterType="npc-2"
      />
      <AICharacter 
        startX={200} 
        startY={490} 
        pathSegments={npcPaths.trainer}
        characterType="npc-1"
      />
      {children}
    </div>
  );
});

export default Map;