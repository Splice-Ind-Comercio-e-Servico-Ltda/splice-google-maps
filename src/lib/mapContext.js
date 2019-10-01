import React, { createContext, useEffect, useRef, useCallback, useState } from 'react';
import { useGoogleMaps } from 'splice-react-hooks';

import { isAFunction, containsKey, isANumber } from './utils';

export const MapContext = createContext({});

export default ({
  children,
  boundsRef,
  createBoundsRef,
  mapRef,
  clientId = process.env.GOOGLE_MAPS_CLIENT_ID,
  center,
  zoom = 12,
  disableDefaultUI = true,
  fullScreenControl = false,
  gestureHandling = false,
}) => {
  if (boundsRef && isAFunction(createBoundsRef)) {
    throw new Error('If you provide a boundsRef the parameter createBoundsRef is necessary.');
  }

  if (isAFunction(createBoundsRef) && !boundsRef) {
    throw new Error(
      'If a createBoundsRef function is provided, an initial boundsRef is necessary.'
    );
  }

  if (zoom && !isANumber(zoom)) {
    throw new Error('Zoom must be an integer.');
  }

  if (center && (!containsKey(center, 'lat') || !containsKey(center, 'lng'))) {
    throw new Error('Center object must have a lat and lng property.');
  }

  const _clientId = clientId;
  const { googleMapsReady } = useGoogleMaps({ clientId: _clientId });

  const _mapRef = mapRef || useRef();
  const _boundsRef = boundsRef || useRef();

  const [_mapInstance, _setMapInstance] = useState();

  const _createBounds = useCallback(() => {
    _boundsRef.current = new window.google.maps.LatLngBounds();
  }, [_boundsRef]);

  const extendBounds = useCallback(
    (position) => {
      _boundsRef.current.extend(position);
    },
    [_boundsRef]
  );

  const fitBounds = useCallback(() => {
    _mapInstance.fitBounds(_boundsRef.current);

    _createBounds();
  }, [_boundsRef, _mapInstance, _createBounds]);

  const value = {
    mapRef: _mapRef,
    mapInstance: _mapInstance,
    extendBounds,
    fitBounds,
  };

  const _mapSetup = useCallback(
    () =>
      _setMapInstance(
        new window.google.maps.Map(_mapRef.current, {
          center: center || { lat: -18.791918, lng: -407.230804 },
          zoom: zoom,
          disableDefaultUI,
          fullScreenControl,
          gestureHandling,
        })
      ),
    [center, zoom, _mapRef, disableDefaultUI, fullScreenControl, gestureHandling]
  );

  useEffect(() => {
    if (_mapRef.current && googleMapsReady) {
      _mapSetup();

      _createBounds();
    }
  }, [googleMapsReady, _boundsRef, _mapRef, _createBounds, _mapSetup]);

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};
