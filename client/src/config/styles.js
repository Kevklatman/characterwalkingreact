// src/config/styles.js
export const createGameStyles = (assets) => `
  :root {
    --player-sprite: url('${assets.CHARACTERS.PLAYER}');
    --npc-sprite: url('${assets.CHARACTERS.NPC}');
    --outside-map: url('${assets.MAPS.OUTSIDE}');
    --house-map: url('${assets.MAPS.HOUSE_INTERIOR}');
  }

  .map-outside {
    background-image: var(--outside-map);
  }

  .map-house {
    background-image: var(--house-map);
  }
`;

// In your App component or initializatio