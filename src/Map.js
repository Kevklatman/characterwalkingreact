import React from 'react';
import NewpalletTownImage from './NewpalletTown.png'; // Import the image file

const Map = () => {
  return (
    <div className="map">
      <img src={NewpalletTownImage} alt="Map" className="map-image" />
    </div>
  );
};

export default Map;