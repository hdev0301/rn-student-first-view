import {createSelector} from 'reselect';
import {forEach, get, toUpper, set, find} from 'lodash';
import i18n from '../i18n/i18n.js';
import {bearingToDirection, getColorByIndex} from '../utils/mapUtils';
import {sortStopVisitTimes, shouldShowStop} from '../utils/stopUtils';
import {getFormattedTime, getDifferenceFromNowInMinutes} from '../utils/dateUtils';

const selectEta = () => (state) => state.eta.etaData;
const selectEtaFetchTime = () => (state) => state.eta.etaFetchTime;
const selectDirections = () => (state) => state.eta.directionsData;
const selectStudents = () => (state) => state.students.studentsData;

const selectStops = () => createSelector(
  selectStudents(),
  selectEta(),
  selectEtaFetchTime(),
  selectDirections(),
  (students, eta, etaFetchTime, directions) => {
    const stopCustomNameSuffix = i18n.t('tracker-stopCustomNameSuffix');
    const stopCustomNamePossessive = i18n.t('tracker-stopCustomNamePossessive');
    const fetchDiffFromNowInMin = getDifferenceFromNowInMinutes(etaFetchTime);
    let stops = [];
    let hasInactiveStops = false;
    forEach(students, (student, studentIndex) => {
      const schoolName = get(student, 'school.name');
      const color = getColorByIndex(studentIndex);
      const schoolLat = get(student, 'school.location.lat');
      const schoolLng = get(student, 'school.location.lng');
      let studentStops = [];
      forEach(student.stops, stopData => {
        const routeId = stopData.route_id;
        const period = toUpper(stopData.period);
        const stopId = get(stopData, 'stop.id');

        const stopCustomNamePeriod = i18n.t(`tracker-stopCustomNamePeriod-${period}`);

        const stopLat = get(stopData, 'stop.lat');
        const stopLng = get(stopData, 'stop.lng');

        let stop = {
          period,
          stopId,
          routeId,
          schoolName,
          color,
          id: stopData.id,
          customName: `${student.first_name}${stopCustomNamePossessive} ${stopCustomNamePeriod} ${stopCustomNameSuffix}`,
          stopName: get(stopData, 'stop.name'),
          latitude: stopLat,
          longitude: stopLng
        };

        let timeString = stopData.scheduled_time;
        let timeZone = stopData.time_zone;
        let type = 'scheduled';

        let schoolType = 'scheduled';
        let schoolTimeString = null;
        let pickupOrDropoff = null;

        // map only mode
        let busStatus = 'no data';
        let busCompleteStatus = 'not complete';
        let shouldShowBus = false;
        let serviceStartTime = null;

        const vehicleData = find(eta, (v) => {
          return v.route_id === routeId && get(v, 'stop.id') === stopId && toUpper(v.period) === period;
        });

        if (vehicleData) {
          const vehicleLat =  get(vehicleData, 'vehicle_location.lat');
          const vehicleLng =  get(vehicleData, 'vehicle_location.lng');
          serviceStartTime = vehicleData.service_start_time;

          if (vehicleLat && vehicleLng) {
            stop.vehicle = {
              latitude: vehicleLat,
              longitude: vehicleLng,
              direction: bearingToDirection(get(vehicleData, 'vehicle_location.bearing'))
            };

            const directionsData = find(directions, (d) => {
              return d.stop.latitude === stopLat && d.stop.longitude === stopLng && d.vehicle.latitude === vehicleLat && d.vehicle.longitude === vehicleLng;
            });

            if (directionsData) {
              stop.directions = directionsData.coordinates;
            }
          }

          if (fetchDiffFromNowInMin <= 15 && vehicleData.type && vehicleData.time_zone) {
            timeZone = vehicleData.time_zone;
            type = vehicleData.type;

            if (type === 'estimated') {
              const estimatedMinutesFromNow = vehicleData.estimated_time_from_now_minutes;
              stop.minutes = estimatedMinutesFromNow >= 0 && estimatedMinutesFromNow <= 60 ? estimatedMinutesFromNow : null;
              timeString = vehicleData.estimated_time;
            } else if (type === 'scheduled') {
              timeString = vehicleData.scheduled_time;
            } else if (type === 'completed') {
              if (vehicleData.completed_time) {
                timeString = vehicleData.completed_time; // we saw the bus at this stop
                type = 'arrived';
              } else {
                timeString = vehicleData.scheduled_time; // the stop was passed but we didn't capture the GPS event
                type = 'visited';
              }
            }
          }

          schoolType = get(vehicleData, 'school.type');
          if (schoolType === 'completed') {
            schoolTimeString = get(vehicleData, 'school.completed_time');
          }

          pickupOrDropoff = vehicleData.pickup_or_dropoff;

          if (pickupOrDropoff === 'pickup') {
            busStatus = Math.round(getDifferenceFromNowInMinutes(serviceStartTime));
            busCompleteStatus = Math.round(getDifferenceFromNowInMinutes(schoolTimeString));

            if ((serviceStartTime && getDifferenceFromNowInMinutes(serviceStartTime) > -15)
                 || stop.minutes != null) {
              shouldShowBus = true; // bus is within 15 minutes of scheduled start time, or we have an ETA
            }
            if (schoolType === 'completed' && getDifferenceFromNowInMinutes(schoolTimeString) > 5) {
              shouldShowBus = false; // bus arrived over 5 minutes ago
            }
          } else { // PM services
            busStatus = Math.round(getDifferenceFromNowInMinutes(serviceStartTime));
            busCompleteStatus = Math.round(getDifferenceFromNowInMinutes(vehicleData.completed_time));

            // serviceStartTime will be null in the ETA feed until closer to start time
            if (serviceStartTime && getDifferenceFromNowInMinutes(serviceStartTime) > -15 || stop.minutes != null) {
              shouldShowBus = true; // bus is within 15 minutes of scheduled start time
            }
            if (vehicleData.completed_time && getDifferenceFromNowInMinutes(vehicleData.completed_time) > 5) {
              shouldShowBus = false; // bus arrived over 5 minutes ago
            }
          }
        }

        stop.busStatus = busStatus;
        stop.busCompleteStatus = busCompleteStatus;
        stop.shouldShowBus = shouldShowBus;
        stop.serviceStartTime = serviceStartTime;

        set(stop, 'school.type', schoolType);
        if (schoolLat && schoolLng) {
          set(stop, 'school.latitude', schoolLat);
          set(stop, 'school.longitude', schoolLng);
        }
        if (schoolTimeString) {
          set(stop, 'school.time', getFormattedTime(schoolTimeString, null, 'hh:mm A'));
        }

        stop.pickupOrDropoff = pickupOrDropoff;

        stop.type = type;
        stop.time = getFormattedTime(timeString, timeZone);

        if (shouldShowStop(stopData.scheduled_time, timeZone)) {
          studentStops.push(stop);
        } else {
          hasInactiveStops = true;
        }
      });
      stops = stops.concat(studentStops);
    });
    return {
      stops: stops.sort(sortStopVisitTimes),
      hasInactiveStops
    };
  }
);

export {
  selectStops
};
