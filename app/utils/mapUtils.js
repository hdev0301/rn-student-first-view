import R from 'ramda';
import {isNumber} from 'lodash';
import {direction} from '../components/BusIcon';
import {colors} from '../themes';

export const removeEmpty = (markers = []) => {
  let filteredMarkers = R.filter((item) => {
    return item.latitude && item.longitude;
  }, markers);
  return filteredMarkers
};

export const calculateRegion = (locations, options) => {
  const latPadding = options && options.latPadding ? options.latPadding : 0.1;
  const longPadding = options && options.longPadding ? options.longPadding : 0.1;
  const mapLocations = removeEmpty(locations);
  // Only do calculations if there are locations
  if (mapLocations.length > 0) {
    let allLatitudes = R.map((l) => {
      if (l.latitude && !l.latitude.isNaN) {
        return l.latitude;
      }
    }, mapLocations);

    let allLongitudes = R.map((l) => {
      if (l.longitude && !l.longitude.isNaN) {
        return l.longitude;
      }
    }, mapLocations);

    let minLat = R.reduce(R.min, Infinity, allLatitudes);
    let maxLat = R.reduce(R.max, -Infinity, allLatitudes);
    let minLong = R.reduce(R.min, Infinity, allLongitudes);
    let maxLong = R.reduce(R.max, -Infinity, allLongitudes);

    let middleLat = (minLat + maxLat) / 2;
    let middleLong = (minLong + maxLong) / 2;
    let latDelta = (maxLat - minLat) + latPadding;
    let longDelta = (maxLong - minLong) + longPadding;

    // return markers
    return {
      latitude: middleLat,
      longitude: middleLong,
      latitudeDelta: latDelta,
      longitudeDelta: longDelta
    };
  }
};

export const bearingToDirection = (bearing) => {
  if (isNumber(bearing) && bearing >= 0 && bearing <= 360) {
    const val = Math.floor((bearing + 22.5) / 45);
    const directions = [direction.north, direction.north_east, direction.east, direction.south_east, direction.south, direction.south_west, direction.west, direction.north_west];
    return directions[(val % directions.length)];
  }
  return null;
};

export const getColorByIndex = (index) => {
  const c = [colors.stop01, colors.stop02, colors.stop03, colors.stop04, colors.stop05, colors.stop06, colors.stop07, colors.stop08, colors.stop09, colors.stop10, colors.stop11, colors.stop12];
  return c[(index % c.length)];
};
