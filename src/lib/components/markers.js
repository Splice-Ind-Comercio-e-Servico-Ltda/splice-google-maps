import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types';

import { markerPropTypes } from '../propTypes';

import { hasContent, setupGoogleMapsEventListeners, isAFunction } from '../utils';

const propTypes = {
  markers: PropTypes.arrayOf(PropTypes.shape(markerPropTypes)),
  mapInstance: PropTypes.object,
  extendBounds: PropTypes.func,
  fitBounds: PropTypes.func,
};

const defaultProps = {
  markers: [],
  shouldFitBounds: true,
};

const Markers = ({ markers, mapInstance, shouldFitBounds, extendBounds, fitBounds }) => {
  const [_markers, _setMarkers] = useState([]);
  const _mapInstance = useMemo(() => mapInstance, [mapInstance]);
  const _shouldFitBounds = useMemo(() => shouldFitBounds, [shouldFitBounds]);

  useEffect(() => {
    Promise.all([
      new Promise(() => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@googlemaps/markerclustererplus/dist/index.min.js';
        script.async = true;
        document.body.appendChild(script);
      }),
    ]);
  }, []);

  const _canCreateInfoWindow = useCallback(
    (windowId) => document.getElementById(windowId) === null,
    []
  );

  const _getInfoWindowId = useCallback((markerIndex) => {
    return `iwgm-${markerIndex}`;
  }, []);

  const _renderToDom = useCallback(({ Content, contentData = {}, elementId }) => {
    render(<Content {...contentData} />, document.getElementById(elementId));
  }, []);

  const _createInfoWindow = useCallback(
    (
      {
        content,
        contentData,
        onDomReady,
        onCloseClickOnce,
        onContentChanged,
        onCloseClick,
        onPositionChanged,
        onZIndexChanged,
      },
      windowId
    ) => {
      const configs = {
        content: `<div id="${windowId}"></div>`,
      };

      const instancedInfoWindow = new window.google.maps.InfoWindow(configs);

      const events = [
        { name: 'closeclick', callback: onCloseClick, onceCallback: onCloseClickOnce },
        { name: 'content_changed', callback: onContentChanged },
        {
          name: 'domready',
          callback: () => {
            _renderToDom({ Content: content, contentData: contentData, elementId: windowId });

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
    [_renderToDom]
  );

  const _clearMarkers = useCallback(() => _markers.forEach((marker) => marker.setMap(null)), [
    _markers,
  ]);

  const _openInfoWindow = useCallback(
    (markerIndex, instancedMarker, infoWindow) => {
      if (infoWindow && infoWindow.content) {
        const windowId = _getInfoWindowId(markerIndex);

        if (_canCreateInfoWindow(windowId)) {
          const instancedInfoWindow = _createInfoWindow(infoWindow, windowId);

          instancedInfoWindow.open(_mapInstance, instancedMarker);
        }
      }
    },
    [_createInfoWindow, _getInfoWindowId, _canCreateInfoWindow, _mapInstance]
  );

  const _initMarkers = useCallback(() => {
    const _markersToCluster = markers.map(
      (
        {
          infoWindow,
          onClick,
          onDoubleClick,
          onDragStart,
          onDrag,
          onDragEnd,
          onPositionChanged,
          position,
          icon,
        },
        index
      ) => {
        const instancedMarker = new window.google.maps.Marker({
          map: _mapInstance,
          position: position,
          icon,
        });

        const events = [
          {
            name: 'click',
            callback: (event) => {
              const openInfoWindow = () => _openInfoWindow(index, instancedMarker, infoWindow);

              if (isAFunction(onClick)) {
                onClick(event, { infoWindow, openInfoWindow });
              } else {
                openInfoWindow();
              }
            },
          },
          { name: 'dblclick', callback: onDoubleClick },
          { name: 'drag', callback: onDrag },
          { name: 'dragend', callback: onDragEnd },
          { name: 'dragstart', callback: onDragStart },
          { name: 'position_changed', callback: onPositionChanged },
        ];

        setupGoogleMapsEventListeners(instancedMarker, events);

        return instancedMarker;
      }
    );
    _setMarkers(_markersToCluster);

    if (markers.length > 0) {
      new window.MarkerClusterer(_mapInstance, _markersToCluster, {
        imagePath: 'https://mob2bcontent.blob.core.windows.net/sits/icones/m',
      });
    }
  }, [_mapInstance, markers, _openInfoWindow]);

  // Clean up effect and call the init
  useEffect(() => {
    if (_mapInstance) {
      _clearMarkers();

      _initMarkers();
    }
  }, [_mapInstance, markers, _initMarkers]); // eslint-disable-line

  // Bounds effect
  useEffect(() => {
    if (hasContent(_markers) && _shouldFitBounds) {
      _markers.forEach((marker) => {
        extendBounds(marker.position);
      });

      fitBounds(mapInstance);
    }
  }, [extendBounds, fitBounds, _markers, _shouldFitBounds, mapInstance]);

  // Events clean up
  useEffect(() => {
    return () => {
      if (_markers) {
        _markers.forEach((instancedMarker) => {
          window.google.maps.event.clearInstanceListeners(instancedMarker);
        });
      }
    };
  }, [_markers]);

  return null;
};

Markers.propTypes = propTypes;
Markers.defaultProps = defaultProps;

export default Markers;
