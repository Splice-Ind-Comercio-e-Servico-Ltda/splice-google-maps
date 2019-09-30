import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { MapContext } from '../mapContext';

const propTypes = {
  loadingComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  mapClassName: PropTypes.string,
};

const defaultProps = {
  loadingComponent: null,
  mapClassName: '',
};

const Map = ({ loadingComponent: LoadingComponent, mapClassName }) => {
  const { mapRef } = useContext(MapContext);

  return (
    <div className={mapClassName} ref={mapRef}>
      {LoadingComponent && <LoadingComponent />}
    </div>
  );
};

Map.propTypes = propTypes;
Map.defaultProps = defaultProps;

export default Map;
