import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { MapContext } from '../mapContext';

const Map = () => {
  const { mapRef } = useContext(MapContext);

  return (
    <div style={{ height: '400px', width: '400px' }} ref={mapRef}>
      carregando...
    </div>
  );
};

export default Map;
