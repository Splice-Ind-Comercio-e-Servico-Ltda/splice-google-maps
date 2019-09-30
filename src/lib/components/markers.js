import { useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import { MapContext } from '../mapContext';

import { markerPropTypes } from '../propTypes';

import { hasContent } from '../utils';

const propTypes = {
  markers: PropTypes.arrayOf(PropTypes.shape(markerPropTypes)),
};

const defaultProps = {
  markers: [],
};

const Markers = ({ markers }) => {
  const { extendBounds, fitBounds, mapInstance } = useContext(MapContext);

  const [_markers, _setMarkers] = useState([]);

  const _initMarkers = useCallback(() => {
    _setMarkers(
      markers.map(
        (marker) =>
          new window.google.maps.Marker({
            map: mapInstance,
            position: marker.position,
          })
      )
    );
  }, [mapInstance, markers]);

  // Clean up effect and call the init
  useEffect(() => {
    if (mapInstance) {
      _markers.forEach((marker) => marker.setMap(null));

      _initMarkers();
    }
  }, [mapInstance, markers, _initMarkers]);

  useEffect(() => {
    if (hasContent(_markers)) {
      _markers.forEach((marker) => {
        extendBounds(marker.position);
      });

      fitBounds();
    }
  }, [extendBounds, fitBounds, _markers]);

  return null;
};

Markers.propTypes = propTypes;
Markers.defaultProps = defaultProps;

export default Markers;
