// src/hooks/useAssets.js
import { useState, useEffect } from 'react';
import { assetManager } from '../utils/assetLoader';

export const useAssets = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        await assetManager.preloadAllAssets();
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    loadAssets();

    // Cleanup on unmount
    return () => assetManager.clearCache();
  }, []);

  return { isLoading, error };
};