// Map.js
import React, { forwardRef } from 'react';
import NewpalletTownImage from './NewpalletTown.png';

const Map = forwardRef((props, ref) => {
  return (
    <div ref={ref} className="map">
      <img src={NewpalletTownImage} alt="Map" className="map-image" />
      {props.children}
    </div>
  );
});

export default Map;