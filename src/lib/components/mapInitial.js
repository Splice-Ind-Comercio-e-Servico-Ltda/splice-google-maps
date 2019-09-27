// TODO: Refactor this component name
import React from 'react';

import MapProvider from '../mapContext';

import Map from './map';

const MapInitial = (props) => {
  return (
    <MapProvider {...props}>
      <Map />
    </MapProvider>
  );
};

export default MapInitial;
