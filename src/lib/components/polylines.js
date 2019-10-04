import { useMemo, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import { setupGoogleMapsEventListeners, hasContent } from '../utils';

import { polylinePropTypes } from '../propTypes';

const propTypes = {
  polylines: PropTypes.arrayOf(PropTypes.shape(polylinePropTypes)),
  mapInstance: PropTypes.object,
  extendBounds: PropTypes.func.isRequired,
  fitBounds: PropTypes.func.isRequired,
  shouldFitBounds: PropTypes.bool,
};

const defaultProps = {
  polylines: [],
  shouldFitBounds: true,
};

const Polylines = ({ mapInstance, extendBounds, fitBounds, polylines, shouldFitBounds }) => {
  const [_polylines, _setPolylines] = useState([]);

  const _mapInstance = useMemo(() => mapInstance, [mapInstance]);
  const _shouldFitBounds = useMemo(() => shouldFitBounds, [shouldFitBounds]);

  const _createPolyline = useCallback(
    ({
      isClickable = true,
      isDraggable = false,
      isEditable = false,
      isGeodesic = false,
      onClick,
      onDoubleClick,
      onDrag,
      onDragEnd,
      onDragStart,
      path,
      strokeColor = '#428bca',
      strokeOpacity = 1,
      strokeWeight = 5,
      isVisible = true,
    }) => {
      const polyline = new window.google.maps.Polyline({
        clickable: isClickable,
        draggable: isDraggable,
        editable: isEditable,
        geodesic: isGeodesic,
        map: _mapInstance,
        path,
        strokeColor,
        strokeOpacity,
        strokeWeight,
        visible: isVisible,
      });

      const events = [
        { name: 'click', callback: onClick },
        { name: 'dblclick', callback: onDoubleClick },
        { name: 'drag', callback: onDrag },
        { name: 'dragend', callback: onDragEnd },
        { name: 'dragstart', callback: onDragStart },
      ];

      setupGoogleMapsEventListeners(polyline, events);

      return polyline;
    },
    [_mapInstance]
  );

  const _clearPolylines = useCallback(
    () => _polylines.forEach((polyline) => polyline.setMap(null)),
    [_polylines]
  );

  const _initPolylines = useCallback(() => {
    _setPolylines(() =>
      polylines.reduce((prev, curr) => {
        if (hasContent(curr.path)) {
          const instancedPath = curr.path.map((p) => {
            if (!(p instanceof window.google.maps.LatLng)) {
              return new window.google.maps.LatLng(p.lat, p.lng);
            }

            return p;
          });

          const instancedPolyline = _createPolyline({ ...curr, path: instancedPath });

          return [...prev, instancedPolyline];
        }

        return prev;
      }, [])
    );
  }, [_createPolyline, polylines]);

  useEffect(() => {
    if (_mapInstance) {
      _clearPolylines();

      _initPolylines();
    }
  }, [_initPolylines, polylines, _mapInstance]); // eslint-disable-line

  // Bounds effect
  useEffect(() => {
    if (hasContent(_polylines) && _shouldFitBounds) {
      _polylines.forEach((polyline) => {
        const path = polyline.getPath();

        if (hasContent(path)) {
          path.forEach((latLng) => {
            extendBounds(latLng);
          });
        }
      });

      fitBounds(_mapInstance);
    }
  }, [extendBounds, fitBounds, _polylines, _shouldFitBounds, _mapInstance]);

  return null;
};

Polylines.propTypes = propTypes;
Polylines.defaultProps = defaultProps;

export default Polylines;
