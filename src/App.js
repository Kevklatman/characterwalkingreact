// App.js
import React, { useRef } from 'react';
import Map from './Map';
import Character from './Character';

function App() {
  const mapRef = useRef(null);

  return (
    <div className="app">
      <Map ref={mapRef}>
        <Character mapRef={mapRef} />
      </Map>
    </div>
  );
}

export default App;