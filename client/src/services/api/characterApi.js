// src/services/api/characterApi.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const characterApi = {
  async move(x, y, direction) {
    try {
      const response = await fetch(`${API_BASE_URL}/move`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ x, y, direction }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Move API error:', error);
      throw error;
    }
  },

  async stopMovement(x, y) {
    try {
      const response = await fetch(`${API_BASE_URL}/stop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ x, y }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Stop movement API error:', error);
      throw error;
    }
  },

  async getAICharacters() {
    try {
      const response = await fetch(`${API_BASE_URL}/ai-characters`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Get AI characters API error:', error);
      throw error;
    }
  }
};