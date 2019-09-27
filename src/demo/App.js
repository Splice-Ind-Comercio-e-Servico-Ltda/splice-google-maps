import React from 'react';

import { MapInitial } from '../lib/index';

const App = () => {
  const markers = [
    {
      position: { lat: -19.09354, lng: -75.59824 },
    },
    {
      position: { lat: 55.45132, lng: -85.23243 },
    },
  ];

  return (
    <div>
      <MapInitial markers={markers} />
    </div>
  );
};

export default App;
