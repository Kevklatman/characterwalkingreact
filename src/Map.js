// Map.js
import React, { forwardRef } from 'react';
import './index.css';
import NewpalletTown from './NewpalletTown.png';

const Map = forwardRef(({ children, walkableGrid }, ref) => {
  return (
    <div 
      className="map" 
      ref={ref}
      style={{
        backgroundImage: `url(${NewpalletTown})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: '100%',
        height: '0',
        paddingBottom: '90%', // Adjust this value based on the aspect ratio
        position: 'relative'
      }}
    >
      {children}
    </div>
  );
});

export default Map;