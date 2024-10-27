import React, { useRef, useState, useEffect } from 'react';
import Map from './Map';
import Character from './Character';
import LoadingScreen from './LoadingScreen';
import ErrorBoundary from './ErrorBoundary';
import audioManager from './audio';

function App() {
    const mapRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMusicEnabled, setIsMusicEnabled] = useState(false);
    const [volume, setVolume] = useState(0.5);

    useEffect(() => {
        // Simulate asset loading
        const loadAssets = async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setIsLoading(false);
        };

        loadAssets();
    }, []);

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
                {/* Audio Controls */}
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
                    <Map ref={mapRef}>
                        <Character mapRef={mapRef} />
                    </Map>
                </div>
            </div>
        </ErrorBoundary>
    );
}

export default App;