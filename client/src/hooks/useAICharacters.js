// src/hooks/useAICharacters.js
import { useState, useEffect } from 'react';
import { characterApi } from '../services/api/characterApi';

export const useAICharacters = () => {
  const [aiCharacters, setAICharacters] = useState([]);

  useEffect(() => {
    const updateAICharacters = async () => {
      try {
        const characters = await characterApi.getAICharacters();
        setAICharacters(characters);
      } catch (error) {
        console.error('Error fetching AI characters:', error);
      }
    };

    const interval = setInterval(updateAICharacters, 16);
    return () => clearInterval(interval);
  }, []);

  return aiCharacters;
};