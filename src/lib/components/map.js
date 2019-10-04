import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import { setupGoogleMapsEventListeners } from '../utils';

const propTypes = {
  loadingComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  mapClassName: PropTypes.string,
  onClick: PropTypes.func,
  onClickOnce: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onDrag: PropTypes.func,
  onDragEnd: PropTypes.func,
  onDragStart: PropTypes.func,
  onRightClick: PropTypes.func,
  onCenterChanged: PropTypes.func,
  onBoundsChanged: PropTypes.func,
  mapRef: PropTypes.object.isRequired,
  mapInstance: PropTypes.object,
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
  mapRef,
  mapInstance,
}) => {
  const _mapInstance = useMemo(() => mapInstance, [mapInstance]);

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
    if (_mapInstance) {
      setupGoogleMapsEventListeners(_mapInstance, _events);
    }

    return () => {
      if (_mapInstance) {
        window.google.maps.event.clearInstanceListeners(_mapInstance);
      }
    };
  }, [_mapInstance, _events]);

  return (
    <div className={mapClassName} ref={mapRef}>
      {LoadingComponent && <LoadingComponent />}
    </div>
  );
};

Map.propTypes = propTypes;
Map.defaultProps = defaultProps;

export default Map;
