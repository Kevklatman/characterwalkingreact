import React, { useRef, useState, useEffect } from 'react';
import Map from './Map';
import Character from './Character';
import LoadingScreen from './LoadingScreen';
import ErrorBoundary from './ErrorBoundary';
import audioManager from './audio';
import newPalletTown from './NewpalletTown.png';
import houseInterior from './House1Interior.png';

const MAPS = {
  outside: {
    backgroundImage: newPalletTown,  // Note the leading slash
    spawnPoints: {
      default: { x: 376, y: 300 },
      fromHouse: { x: 380, y: 160 }
    }
  },
  house: {
    backgroundImage: houseInterior,  // Note the leading slash
    spawnPoints: {
      default: { x: 240, y: 400 },
      fromOutside: { x: 240, y: 420 }
    }
  }
};

function App() {
    const mapRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentMap, setCurrentMap] = useState('outside');
    const [isMusicEnabled, setIsMusicEnabled] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [playerPosition, setPlayerPosition] = useState(MAPS[currentMap].spawnPoints.default);

    useEffect(() => {
        const loadAssets = async () => {
            // Check if map image is loading
            const img = new Image();
            img.src = MAPS[currentMap].backgroundImage;
            img.onload = () => {
                console.log('Map image loaded successfully');
                setIsLoading(false);
            };
            img.onerror = (e) => {
                console.error('Error loading map image:', e);
                setIsLoading(false); // Still set loading to false to allow interaction
            };
        };

        loadAssets();
    }, [currentMap]);

    const handleMapTransition = (newMap, spawnPoint = 'default') => {
        setCurrentMap(newMap);
        setPlayerPosition(MAPS[newMap].spawnPoints[spawnPoint]);
    };

    const toggleMusic = () => {
        if (isMusicEnabled) {
            audioManager.stopBackgroundMusic();
        } else {
            audioManager.playBackgroundMusic();
        }
        setIsMusicEnabled(!isMusicEnabled);
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        audioManager.setVolume(newVolume);
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <ErrorBoundary>
            <div className="app">
                <div className="audio-controls absolute top-4 right-4 flex items-center gap-4 bg-black/50 p-2 rounded">
                    <button 
                        onClick={toggleMusic}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        {isMusicEnabled ? 'Disable Music' : 'Enable Music'}
                    </button>
                    <div className="flex items-center gap-2">
                        <label htmlFor="volume" className="text-white">Volume:</label>
                        <input
                            id="volume"
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="w-24"
                        />
                    </div>
                </div>

                <div className="game-container">
                    <Map 
                        ref={mapRef}
                        backgroundImage={MAPS[currentMap].backgroundImage}
                    >
                        <Character 
                            mapRef={mapRef}
                            currentMap={currentMap}
                            onMapTransition={handleMapTransition}
                            initialPosition={playerPosition}
                        />
                    </Map>
                </div>
            </div>
        </ErrorBoundary>
    );
}

export default App;