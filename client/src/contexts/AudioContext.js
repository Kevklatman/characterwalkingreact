// src/contexts/AudioContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import audioManager from '../services/audio/audioManager';

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const toggleAudio = () => {
    if (isEnabled) {
      audioManager.stopBackgroundMusic();
    } else {
      audioManager.playBackgroundMusic();
    }
    setIsEnabled(!isEnabled);
  };

  const updateVolume = (newVolume) => {
    setVolume(newVolume);
    audioManager.setVolume(newVolume);
  };

  useEffect(() => {
    audioManager.initializeAudio();
  }, []);

  return (
    <AudioContext.Provider value={{ isEnabled, volume, toggleAudio, updateVolume }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};