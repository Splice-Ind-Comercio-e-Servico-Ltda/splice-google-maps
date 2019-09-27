import React, { createContext, useEffect, useRef, useCallback } from 'react';

import { useGoogleMaps } from './tempHooks';

export const MapContext = createContext({});

export default ({ children, markers, boundsRef }) => {
  const clientId = process.env.REACT_APP_GOOGLE_MAPS_CLIENT_ID;
  const { googleMapsReady } = useGoogleMaps({ clientId: clientId });
  const _mapRef = useRef();
  const _boundsRef = boundsRef || useRef();

  useEffect(() => {
    if (_mapRef.current && googleMapsReady) {
      const _instance = new window.google.maps.Map(_mapRef.current, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
      });

      _boundsRef.current = new window.google.maps.LatLngBounds();

      markers.forEach((marker) => {
        new window.google.maps.Marker({
          map: _instance,
          position: marker.position,
        });

        _boundsRef.current.extend(marker.position);
      });

      _instance.fitBounds(_boundsRef.current);
    }
  }, [googleMapsReady, markers, _boundsRef]);

  const extendBounds = useCallback(
    (position) => {
      _boundsRef.current.extend(position);
    },
    [_boundsRef]
  );

  const value = {
    mapRef: _mapRef,
    extendBounds,
    markers,
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};
