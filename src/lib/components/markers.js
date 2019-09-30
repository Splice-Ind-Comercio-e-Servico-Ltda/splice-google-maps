import React, { useContext, useState, useEffect, useCallback } from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types';

import { MapContext } from '../mapContext';

import { markerPropTypes } from '../propTypes';

import { hasContent, setupGoogleMapsEventListeners, isAFunction } from '../utils';

// import InfoWindow from './infoWindow';

const propTypes = {
  markers: PropTypes.arrayOf(PropTypes.shape(markerPropTypes)),
};

const defaultProps = {
  markers: [],
};

const Markers = ({ markers }) => {
  const { extendBounds, fitBounds, mapInstance } = useContext(MapContext);

  const [_markers, _setMarkers] = useState([]);

  const _renderToDom = useCallback((Content) => {
    render(<Content />, document.getElementById('iwgm'));
  }, []);

  const _createInfoWindow = useCallback(
    ({
      content,
      onDomReady,
      onCloseClickOnce,
      onContentChanged,
      onCloseClick,
      onPositionChanged,
      onZIndexChanged,
    }) => {
      const configs = {
        content: `<div id="iwgm"></div>`,
      };

      const instancedInfoWindow = new window.google.maps.InfoWindow(configs);

      const events = [
        { name: 'closeclick', callback: onCloseClick, onceCallback: onCloseClickOnce },
        { name: 'content_changed', callback: onContentChanged },
        {
          name: 'domready',
          callback: () => {
            _renderToDom(content);

            if (onDomReady && isAFunction(onDomReady)) {
              onDomReady();
            }
          },
        },
        { name: 'position_changed', callback: onPositionChanged },
        { name: 'zindex_changed', callback: onZIndexChanged },
      ];

      setupGoogleMapsEventListeners(instancedInfoWindow, events);

      return instancedInfoWindow;
    },
    []
  );

  const _initMarkers = useCallback(() => {
    _setMarkers(
      markers.map((marker) => {
        const instancedMarker = new window.google.maps.Marker({
          map: mapInstance,
          position: marker.position,
        });

        if (marker.infoWindow && marker.infoWindow.content) {
          instancedMarker.addListener('click', () => {
            // Maybe clear opened info windows.
            const infoWindow = _createInfoWindow(marker.infoWindow);

            infoWindow.open(mapInstance, instancedMarker);
          });
        }

        return instancedMarker;
      })
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
