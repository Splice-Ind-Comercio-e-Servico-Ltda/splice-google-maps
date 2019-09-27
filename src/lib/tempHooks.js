import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

const cachedScripts = [];

/**
 * Loads external scripts.
 * @param {String} config Object with the configurations;
 * @param {String} config.src Script's url;
 * @param {Boolean} [config.async] If should be loaded as async. Defaults as true;
 * @param {Boolean} [config.defer] If should defer the load. Defaults as true;
 * @returns {Boolean} True for loaded script and false for errors.
 */
export const useExternalScript = ({ src, async = true, defer = true }) => {
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    const scriptAlreadyLoaded = cachedScripts.includes(src);

    if (scriptAlreadyLoaded) setScriptReady(true);
    else {
      cachedScripts.push(src);
      const script = document.createElement('script');

      script.src = src;
      script.async = async;
      script.defer = defer;

      const onScriptLoad = () => {
        setScriptReady(true);
      };

      const onScriptError = () => {
        const index = cachedScripts.indexOf(src);

        if (index >= 0) cachedScripts.splice(index, 1);
        script.remove();

        setScriptReady(false);
      };

      script.addEventListener('load', onScriptLoad);
      script.addEventListener('error', onScriptError);

      document.body.appendChild(script);

      return () => {
        script.removeEventListener('load', onScriptLoad);
        script.removeEventListener('error', onScriptError);
      };
    }
  }, [src, defer, async]);

  return scriptReady;
};

/**
 * Loads google api script and returns some functions.
 * @param {String} clientId Your Google client ID;
 * @param {Array[String]} libraries List of libraries to load;
 * @param {String} [versioning] Weekly, quarterly (default) or version number (Ex: 3.38);
 * @returns {Boolean} googleMapsReady as true for loaded and false for error;
 * @returns {Function} getAddressAndLocation returns a promise that let you get addresses or locations;
 */
export const useGoogleMaps = ({
  clientId,
  libraries,
  versioning = 'quarterly',
  baseUrl = 'https://maps.googleapis.com/maps/api/js',
} = {}) => {
  const geocoderRef = useRef(null);

  const _clientId = useMemo(() => clientId, [clientId]);
  const _versioning = useMemo(() => versioning, [versioning]);
  const _libraries = useMemo(
    () => (Array.isArray(libraries) && libraries.length > 0 ? libraries.join(',') : ''),
    [libraries]
  );

  const src = useMemo(
    () => `${baseUrl}?client=${_clientId}&v=${_versioning}&libraries=${_libraries}`,
    [_clientId, _libraries, _versioning, baseUrl]
  );

  const googleMapsReady = useExternalScript({ src });

  const getAddressAndLocation = useCallback((geocoderConfig) => {
    if (!geocoderRef.current) {
      geocoderRef.current = new window.google.maps.Geocoder();
    }

    return new Promise((resolve) => {
      geocoderRef.current.geocode(geocoderConfig, (results, status) => {
        if (status === 'OK') {
          const {
            formatted_address: address,
            geometry,
            address_components: addressComponents,
          } = results[0];

          const { short_name: shortName } = addressComponents[0];

          const { location } = geometry;

          const number = parseInt(shortName);

          if (!Number.isNaN(number)) resolve({ address, number, location });
          else resolve({ address, location });
        }
      });
    });
  }, []);

  return {
    googleMapsReady,
    getAddressAndLocation,
  };
};
