import React, { useState, useCallback } from 'react';
import {} from 'splice-react-hooks';

import SpliceGoogleMaps from '../lib/index';

import './app.css';

import TestComponent from './testComponent';

const App = () => {
  const [selectedMarkers, setSelectedMarkers] = useState([]);
  const [selectedPolylines, setSelectedPolylines] = useState([]);
  const [mapInstance, setMapInstance] = useState(null);

  const onMarkerClick = useCallback((event, { openInfoWindow, infoWindow }) => {
    openInfoWindow();
  }, []);

  const onMapInstance = useCallback((mapInstance) => {
    setMapInstance(mapInstance);
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

  const polylinePositions = [
    {
      path: [
        {
          lat: -23.529978,
          lng: -47.466717,
        },
        {
          lat: -23.526801,
          lng: -47.450881,
        },
      ],
    },
    {
      path: [
        {
          lat: 28.733947,
          lng: -36.771559,
        },
        {
          lat: -23.526801,
          lng: 28.733947,
        },
      ],
    },
    {
      path: [
        {
          lat: 37.269682,
          lng: -36.771559,
        },
        {
          lat: -23.526801,
          lng: 37.269682,
        },
      ],
    },
    {
      path: [
        {
          lat: -17.513106,
          lng: -36.771559,
        },
        {
          lat: -23.526801,
          lng: -17.513106,
        },
      ],
    },
  ];

  return (
    <div>
      <button
        onClick={() => {
          const numA = Math.floor(Math.random() * (markers.length - 0) + 0);
          const numB = Math.floor(Math.random() * (markers.length - 0) + 0);
          const numC = Math.floor(Math.random() * (polylinePositions.length - 0) + 0);
          const numD = Math.floor(Math.random() * (polylinePositions.length - 0) + 0);

          setSelectedMarkers(() => [markers[numA], markers[numB]]);
          setSelectedPolylines(() => [polylinePositions[numC], polylinePositions[numD]]);
        }}
      >
        Shuffle positions
      </button>
      <button
        onClick={() => {
          setSelectedMarkers(() => []);
          setSelectedPolylines(() => []);
        }}
      >
        Clear positions
      </button>
      <SpliceGoogleMaps
        onMapInstanceCreated={onMapInstance}
        markerProps={{
          markers: selectedMarkers,
        }}
        mapProps={{
          mapClassName: 'map-container',
        }}
        polylineProps={{
          polylines: selectedPolylines,
        }}
      />
    </div>
  );
};

export default App;
