export const isAFunction = (func) => typeof func === 'function';

export const isANumber = (value) => typeof value === 'number';

export const containsKey = (obj, key) => obj.hasOwnProperty(key);

export const hasContent = (arr) => arr && arr.length > 0;

export const stringIsEmptyOrUndefined = (string) => string === undefined || string.length === 0;
