// TODO: Refactor this component name
import React from 'react';

import MapProvider from '../mapContext';

import Map from './map';
import Markers from './markers';

const SpliceGoogleMaps = ({ mapProps, markerProps, config }) => (
  <MapProvider {...config}>
    <Map {...mapProps} />
    <Markers {...markerProps} />
  </MapProvider>
);

export default SpliceGoogleMaps;
