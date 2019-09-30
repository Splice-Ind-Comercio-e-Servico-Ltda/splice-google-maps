import React, { useState, useCallback } from 'react';

import SpliceGoogleMaps from '../lib/index';

import './app.css';

import TestComponent from './testComponent';

const App = () => {
  const [selectedMarkers, setSelectedMarkers] = useState([]);

  const onMarkerClick = useCallback((event, { openInfoWindow, infoWindow }) => {
    openInfoWindow();
  }, []);

  const markers = [
    {
      position: { lat: -19.0935, lng: -75.5984 },
      infoWindow: {
        content: TestComponent,
      },
      onClick: onMarkerClick,
    },
    {
      position: { lat: 55.45132, lng: 0.840424 },
      infoWindow: {
        content: TestComponent,
      },
      onClick: onMarkerClick,
    },
    {
      position: { lat: 0.840424, lng: 55.45132 },
      infoWindow: {
        content: TestComponent,
      },
      onClick: onMarkerClick,
    },
    {
      position: { lat: 55.45132, lng: 27.53625 },
      infoWindow: {
        content: TestComponent,
      },
      onClick: onMarkerClick,
    },
    {
      position: { lat: -19.0935, lng: -85.23243 },
      infoWindow: {
        content: TestComponent,
      },
      onClick: onMarkerClick,
    },
    {
      position: { lat: 55.45132, lng: -19.0935 },
      infoWindow: {
        content: TestComponent,
      },
      onClick: onMarkerClick,
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
