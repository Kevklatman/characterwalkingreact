// src/hooks/useAssetPreloader.js
import { useState, useEffect } from 'react';
import { AssetLoader } from '../utils/assetLoader';
import { MAPS } from '../config/maps';

export const useAssetPreloader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAllAssets = async () => {
      const assetsToLoad = [
        // Map images
        ...Object.values(MAPS).map(map => ({
          type: 'image',
          src: map.backgroundImage
        })),
        // Audio
        {
          type: 'audio',
          src: 'http://localhost:5000/audio/background.mp3'
        }
      ];

      try {
        await AssetLoader.preloadAssets(assetsToLoad);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    loadAllAssets();
  }, []);

  return { isLoading, error };
};