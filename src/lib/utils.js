export const isAFunction = (func) => typeof func === 'function';

export const isANumber = (value) => typeof value === 'number';

export const containsKey = (obj, key) => obj.hasOwnProperty(key);

export const hasContent = (arr) => arr && arr.length > 0;

export const stringIsEmptyOrUndefined = (string) => string === undefined || string.length === 0;

export const setupGoogleMapsEventListeners = (instance, events) =>
  events.map(({ name, callback, onceCallback }) => {
    if (callback && typeof callback === 'function') {
      return window.google.maps.event.addListener(instance, name, (event) => {
        callback(event, instance);
      });
    }
    if (onceCallback && typeof onceCallback === 'function') {
      return window.google.maps.event.addListenerOnce(instance, name, (event) => {
        onceCallback(event, instance);
      });
    }

    return null;
  });
