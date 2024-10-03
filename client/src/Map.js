// Map.js
import React, { forwardRef } from 'react';

const Map = forwardRef(({ children }, ref) => {
  return (
    <div className="map" ref={ref}>
      {children}
    </div>
  );
});

export default Map;