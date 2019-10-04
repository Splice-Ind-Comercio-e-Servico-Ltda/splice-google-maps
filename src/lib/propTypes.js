import { shape, number, object, string, bool, oneOf, oneOfType, arrayOf, func } from 'prop-types';

// https://developers.google.com/maps/documentation/javascript/reference/marker#Animation
export const animation = oneOf(['BOUNCE', 'DROP', '']);

// https://developers.google.com/maps/documentation/javascript/reference/marker#SymbolPath
export const symbolPath = oneOf([
  'BACKWARD_CLOSED_ARROW',
  'BACKWARD_OPEN_ARROW',
  'CIRCLE',
  'FORWARD_CLOSED_ARROW',
  'FORWARD_OPEN_ARROW',
]);

// https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngLiteral
export const latLngLiteral = shape({
  lat: number.isRequired,
  lng: number.isRequired,
});

export const latLng = shape({
  lat: func.isRequired,
  lng: func.isRequired,
});

// https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBoundsLiteral
export const latLngBoundsLiteral = shape({
  east: number,
  north: number,
  south: number,
  west: number,
});

// https://developers.google.com/maps/documentation/javascript/reference/coordinates#Point
export const point = shape({
  x: number,
  y: number,
});

// https://developers.google.com/maps/documentation/javascript/reference/coordinates#Size
export const size = shape({
  width: number,
  height: number,
  widthUnit: string,
  heightUnit: string,
});

// https://developers.google.com/maps/documentation/javascript/reference/marker#Icon
export const icon = shape({
  anchor: point,
  labelOrigin: point,
  origin: point,
  scaledSize: size,
  size: size,
  url: string.isRequired,
});

// https://developers.google.com/maps/documentation/javascript/reference/marker#Symbol
export const symbol = shape({
  anchor: point,
  fillColor: string,
  fillOpacity: number,
  labelOrigin: point,
  path: oneOfType([symbolPath, string]).isRequired,
  rotation: number,
  scale: number,
  strokeColor: string,
  strokeOpacity: number,
  strokeWeight: number,
});

// https://developers.google.com/maps/documentation/javascript/reference/marker#MarkerLabel
export const markerLabel = shape({
  color: string,
  fontFamily: string,
  fontSize: string,
  fontWeight: string,
  text: string,
});

// https://developers.google.com/maps/documentation/javascript/reference/marker#MarkerShape
export const markerShape = shape({
  coords: arrayOf(number),
  type: string,
});

// https://developers.google.com/maps/documentation/javascript/reference/map#MapTypeStyle
export const mapTypeStyle = shape({
  elementType: string,
  featureType: string,
  styles: arrayOf(Object),
});

// https://developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindowOptions
export const infoWindowPropTypes = {
  content: oneOfType([func, object]).isRequired,
  disableAutoPan: bool,
  maxWidth: number,
  pixelOffset: size,
  position: oneOfType([latLng, latLngLiteral]),
  zIndex: number,
  isOpen: bool,
};

export const markerPropTypes = {
  anchorPoint: point,
  animationName: animation,
  isClickable: bool,
  showCrossOnDrag: bool,
  cursor: string,
  isDraggable: bool,
  icon: oneOfType([string, icon, symbol]),
  labelText: oneOfType([string, markerLabel]),
  map: object,
  opacity: number,
  optimized: bool,
  position: oneOfType([latLng, latLngLiteral]).isRequired,
  shape: markerShape,
  hoverText: string,
  isVisible: bool,
  onClick: func,
  onDoubleClick: func,
  onDrag: func,
  onDragEnd: func,
  onDragStart: func,
  onPositionChanged: func,
  infoWindow: shape(infoWindowPropTypes),
};

export const iconSequence = {
  fixedRotation: bool,
  icon: symbol,
  offset: string,
  repeat: string,
};

export const polylinePropTypes = {
  icons: arrayOf(iconSequence),
  isClickable: bool,
  isDraggable: bool,
  isEditable: bool,
  isGeodesic: bool,
  isVisible: bool,
  map: object,
  onClick: func,
  onDoubleClick: func,
  onDrag: func,
  onDragEnd: func,
  onDragStart: func,
  path: arrayOf(oneOfType([latLng, latLngLiteral])),
  strokeColor: string,
  strokeOpacity: number,
  strokeWeight: number,
};
