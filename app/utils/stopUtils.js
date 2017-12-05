import {find, get} from 'lodash';
import moment from 'moment-timezone';

export const formatStopTime = (stopTime) => {
  if (stopTime.charAt(0) == '0')
    return stopTime.slice(1, stopTime.length);
  else
    return stopTime;
};

export const sortStopVisitTimes = (a, b) => {
  const aTime = a.period + a.time;
  const bTime = b.period + b.time;
  if (aTime < bTime) {
    return -1;
  } else if (aTime > bTime) {
    return 1;
  } else {
    return 0;
  }
};

export const getUniqueCoordinates = (currentItems, newItem) => {
  let {latitude, longitude} = newItem;
  while(find(currentItems, item => {
    return (item.latitude === latitude && item.longitude === longitude)
      || (get(item, 'vehicle.latitude') === latitude && get(item, 'vehicle.longitude') === longitude)
      || (get(item, 'school.latitude') === latitude && get(item, 'school.longitude') === longitude);
  })) {
    latitude = latitude - 0.0001;
    longitude = longitude + 0.0002;
  }
  return {latitude, longitude};
};

export const shouldShowStop = (stopTimeString, timeZone) => {
  if (!stopTimeString || !timeZone) {
    return false;
  }
  const currentTime = moment().tz(timeZone);
  const stopTime = moment(stopTimeString, moment.ISO_8601).tz(timeZone);
  const today = currentTime.format('YYYY-MM-DD');
  const getTime = (dateString, timeString) => moment.tz(`${dateString} ${timeString}`, timeZone);
  const shouldShowMorningStops = !currentTime.isBetween(getTime(today, '11:30'), getTime(today, '23:59'));
  return shouldShowMorningStops || stopTime.isBetween(getTime(today, '11:30'), getTime(today, '23:59'));
};
