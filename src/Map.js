// Map.js
import React, { useRef } from 'react';
import NewpalletTownImage from './NewpalletTown.png';

const Map = () => {
  const mapRef = useRef(null);

  return (
    <div ref={mapRef} className="map">
      <img src={NewpalletTownImage} alt="Map" className="map-image" />
    </div>
  );
};

export default Map;
