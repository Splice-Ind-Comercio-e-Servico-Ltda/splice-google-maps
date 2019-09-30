import React, { useState } from 'react';

import SpliceGoogleMaps from '../lib/index';

import './app.css';

const Info = () => <div>This is an info window!</div>;

const App = () => {
  const [selectedMarkers, setSelectedMarkers] = useState([]);
  const markers = [
    {
      position: { lat: -19.0935, lng: -75.5984 },
      infoWindow: {
        content: Info,
      },
    },
    {
      position: { lat: 55.45132, lng: 0.840424 },
      infoWindow: {
        content: Info,
      },
    },
    {
      position: { lat: 0.840424, lng: 55.45132 },
      infoWindow: {
        content: Info,
      },
    },
    {
      position: { lat: 55.45132, lng: 27.53625 },
      infoWindow: {
        content: Info,
      },
    },
    {
      position: { lat: -19.0935, lng: -85.23243 },
      infoWindow: {
        content: Info,
      },
    },
    {
      position: { lat: 55.45132, lng: -19.0935 },
      infoWindow: {
        content: Info,
      },
    },
  ];

  return (
    <div>
      <button
        onClick={() => {
          const num = Math.floor(Math.random() * (markers.length - 0) + 0);
          const num2 = Math.floor(Math.random() * (markers.length - 0) + 0);

          setSelectedMarkers(() => [markers[num], markers[num2]]);
        }}
      >
        Shuffle positions
      </button>
      <button
        onClick={() => {
          setSelectedMarkers(() => []);
        }}
      >
        Clear positions
      </button>
      <SpliceGoogleMaps
        markerProps={{
          markers: selectedMarkers,
        }}
        mapProps={{
          mapClassName: 'map-container',
        }}
      />
    </div>
  );
};

export default App;
