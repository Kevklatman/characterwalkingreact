// src/components/common/LoadingScreen.js
import React from 'react';

const LoadingScreen = () => (
  <div className="loading-screen flex items-center justify-center h-screen bg-gray-900">
    <div className="text-center">
      <h2 className="text-2xl text-white mb-4">Loading...</h2>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto" />
    </div>
  </div>
);