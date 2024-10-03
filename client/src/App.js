// App.js
import React, { useRef, useState, useEffect } from 'react';
import Map from './Map';
import Character from './Character';
import LoadingScreen from './LoadingScreen';
import ErrorBoundary from './ErrorBoundary';

function App() {
  const mapRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [gameState, setGameState] = useState({
    score: 0,
    level: 1,
    // Add more game state properties as needed
  });

  useEffect(() => {
    // Simulate asset loading
    const loadAssets = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
    };

    loadAssets();
  }, []);

  const updateGameState = (newState) => {
    setGameState(prevState => ({...prevState, ...newState}));
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <div className="app">
        <div className="game-info">
          <p>Score: {gameState.score}</p>
          <p>Level: {gameState.level}</p>
        </div>
        <div className="game-container">
          <Map ref={mapRef}>
            <Character 
              mapRef={mapRef} 
              updateGameState={updateGameState}
            />
          </Map>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;