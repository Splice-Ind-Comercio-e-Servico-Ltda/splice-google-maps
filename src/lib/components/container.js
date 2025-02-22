import React, { useEffect, useRef, useCallback, useState, useMemo } from 'react';

import { useGoogleMapsScript, useGoogleMapsActions } from 'splice-react-hooks';

import { containsKey, isANumber } from '../utils';

import Map from './map';
import Markers from './markers';
import Polylines from './polylines';

const Container = ({
  mapProps = {},
  markerProps = {},
  polylineProps = {},
  clientId = process.env.GOOGLE_MAPS_CLIENT_ID,
  zoom = 12,
  center,
  disableDefaultUI = true,
  fullScreenControl = false,
  gestureHandling = false,
  onMapInstanceCreated,
  styles,
  className,
}) => {
  const _clientId = useMemo(() => clientId, [clientId]);
  const _center = useMemo(() => center, [center]);
  const _zoom = useMemo(() => zoom, [zoom]);
  const _disableDefaultUI = useMemo(() => disableDefaultUI, [disableDefaultUI]);
  const _fullScreenControl = useMemo(() => fullScreenControl, [fullScreenControl]);
  const _styles = useMemo(() => styles, [styles]);
  const _gestureHandling = useMemo(() => gestureHandling, [gestureHandling]);
  const _onMapInstanceCreated = useMemo(() => onMapInstanceCreated, [onMapInstanceCreated]);
  const _markers = useMemo(() => markerProps.markers, [markerProps.markers]);
  const _polylines = useMemo(() => polylineProps.polylines, [polylineProps.polylines]);
  const _mapProps = useMemo(
    () => ({
      ...mapProps,
      className,
    }),
    [mapProps, className]
  );

  const googleMapsReady = useGoogleMapsScript(_clientId);
  const { extendBounds, fitBounds, createBounds } = useGoogleMapsActions();

  const _mapRef = useRef();

  const [_mapInstance, _setMapInstance] = useState(null);

  if (zoom && !isANumber(zoom)) {
    throw new Error('Zoom must be an integer.');
  }

  if (center && (!containsKey(center, 'lat') || !containsKey(center, 'lng'))) {
    throw new Error('Center object must have a lat and lng property.');
  }

  const _mapSetup = useCallback(
    () =>
      _setMapInstance(
        new window.google.maps.Map(_mapRef.current, {
          center: _center || { lat: -18.791918, lng: -407.230804 },
          zoom: _zoom,
          disableDefaultUI: _disableDefaultUI,
          fullScreenControl: _fullScreenControl,
          gestureHandling: _gestureHandling,
          styles: _styles,
        })
      ),
    [_center, _zoom, _disableDefaultUI, _fullScreenControl, _gestureHandling, _styles]
  );

  useEffect(() => {
    if (_mapInstance) {
      createBounds();
    }
  }, [_polylines, _markers, createBounds, _mapInstance]);

  useEffect(() => {
    if (_mapRef.current && googleMapsReady) {
      _mapSetup();
    }
  }, [googleMapsReady, _mapRef, _mapSetup]);

  // Externalizes the mapInstance
  useEffect(() => {
    if (typeof _onMapInstanceCreated === 'function') {
      _onMapInstanceCreated(_mapInstance);
    }
  }, [_mapInstance, _onMapInstanceCreated]);

  return (
    <React.Fragment>
      <Map
        {..._mapProps}
        mapRef={_mapRef}
        mapInstance={_mapInstance}
        extendBounds={extendBounds}
        fitBounds={fitBounds}
      />
      <Markers
        {...markerProps}
        mapInstance={_mapInstance}
        extendBounds={extendBounds}
        fitBounds={fitBounds}
      />
      <Polylines
        {...polylineProps}
        mapInstance={_mapInstance}
        extendBounds={extendBounds}
        fitBounds={fitBounds}
      />
    </React.Fragment>
  );
};

export default Container;
