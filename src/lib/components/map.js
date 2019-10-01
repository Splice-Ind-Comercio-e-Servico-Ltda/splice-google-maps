import React, { useContext, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import { MapContext } from '../mapContext';

import { setupGoogleMapsEventListeners } from '../utils';

const propTypes = {
  loadingComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  mapClassName: PropTypes.string,
};

const defaultProps = {
  loadingComponent: null,
  mapClassName: '',
};

const Map = ({
  loadingComponent: LoadingComponent,
  mapClassName,
  onClick,
  onClickOnce,
  onDoubleClick,
  onDrag,
  onDragEnd,
  onDragStart,
  onRightClick,
  onCenterChanged,
  onBoundsChanged,
}) => {
  const { mapRef, mapInstance } = useContext(MapContext);

  const _events = useMemo(
    () => [
      {
        name: 'click',
        callback: onClick,
        onceCallback: onClickOnce,
      },
      { name: 'dblclick', callback: onDoubleClick },
      { name: 'drag', callback: onDrag },
      { name: 'dragend', callback: onDragEnd },
      { name: 'dragstart', callback: onDragStart },
      { name: 'rightclick', callback: onRightClick },
      { name: 'center_changed', callback: onCenterChanged },
      { name: 'bounds_changed', callback: onBoundsChanged },
    ],
    [
      onBoundsChanged,
      onCenterChanged,
      onClick,
      onClickOnce,
      onDoubleClick,
      onDrag,
      onDragEnd,
      onDragStart,
      onRightClick,
    ]
  );

  // Events clean up and setup
  useEffect(() => {
    if (mapInstance) {
      setupGoogleMapsEventListeners(mapInstance, _events);
    }

    return () => {
      if (mapInstance) {
        window.google.maps.event.clearInstanceListeners(mapInstance);
      }
    };
  }, [mapInstance, _events]);

  return (
    <div className={mapClassName} ref={mapRef}>
      {LoadingComponent && <LoadingComponent />}
    </div>
  );
};

Map.propTypes = propTypes;
Map.defaultProps = defaultProps;

export default Map;
