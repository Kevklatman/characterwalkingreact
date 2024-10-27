// MapTransition.js
const TRANSITION_POINTS = {
    // Format: [x, y, width, height, destinationMap, destinationX, destinationY]
    "HOUSE_1_DOOR": {
      mapName: "NewpalletTown",
      rect: [390, 0, 32, 16],  // Adjust these coordinates to match your door position
      destination: {
        mapName: "House1Interior",
        x: 240,
        y: 400,
        facing: "up"
      }
    },
    "HOUSE_1_EXIT": {
      mapName: "House1Interior",
      rect: [240, 420, 32, 16],
      destination: {
        mapName: "NewpalletTown",
        x: 380,
        y: 160,
        facing: "down"
      }
    }
  };
  
  export const checkTransitionPoint = (x, y, currentMap) => {
    for (const [pointId, data] of Object.entries(TRANSITION_POINTS)) {
      if (data.mapName !== currentMap) continue;
      
      const [doorX, doorY, doorWidth, doorHeight] = data.rect;
      
      if (x >= doorX && x <= doorX + doorWidth &&
          y >= doorY && y <= doorY + doorHeight) {
        return data.destination;
      }
    }
    return null;
  };