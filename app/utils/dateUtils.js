import moment from 'moment-timezone';

moment.updateLocale('en', {
    calendar : {
        lastDay : '[Yesterday at] LT',
        sameDay : '[Today at] LT',
        nextDay : 'dddd [at] LT',
        lastWeek : '[last] dddd [at] LT',
        nextWeek : 'dddd [at] LT',
        sameElse : 'MM/DD/YYYY [at] LT'
    }
});

export const getFormattedTime = (timeString, timeZone, format = 'hh:mm') => {
  if (timeString) {
    if (timeZone) {
      return moment(timeString, moment.ISO_8601).tz(timeZone).format(format);
    } else {
      return moment.parseZone(timeString).format(format);
    }
  }
  return '';
};

export const getTimePeriod = (timeString, timeZone) => {
  return (timeString && timeZone) ? moment(timeString, moment.ISO_8601).tz(timeZone).format('A') : '';
};

export const getDifferenceFromNowInMinutes = (time) => {
  return time ? moment.duration(moment().diff(moment(time))).asMinutes() : null;
};

export const getFormattedUtcDate = (timeString, format = 'MM/DD/YYYY hh:mm A') => {
  return timeString ? moment(timeString, moment.ISO_8601).utc().format('MM/DD/YYYY hh:mm A') : '';
};

export const getFormattedLocalCalendarTime = (timeString) => {
  return timeString ? moment(timeString, moment.ISO_8601).calendar() : '';
};