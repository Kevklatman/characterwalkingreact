// src/components/ui/AudioControls.js
import React from 'react';
import { useAudio } from '../../contexts/AudioContext';

const AudioControls = () => {
  const { isEnabled, volume, toggleAudio, updateVolume } = useAudio();

  return (
    <div className="audio-controls absolute top-4 right-4 flex items-center gap-4 bg-black/50 p-2 rounded">
      <button 
        onClick={toggleAudio}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {isEnabled ? 'Disable Music' : 'Enable Music'}
      </button>
      <div className="flex items-center gap-2">
        <label htmlFor="volume" className="text-white">
          Volume:
        </label>
        <input
          id="volume"
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => updateVolume(parseFloat(e.target.value))}
          className="w-24"
        />
      </div>
    </div>
  );
};

export default AudioControls;