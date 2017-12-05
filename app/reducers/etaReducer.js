import types from '../actions/types';
import immutable from 'seamless-immutable';
import moment from 'moment';
import {createReducer} from 'reduxsauce';
import {colors} from '../themes';
import {cloneDeep, forEach, get} from 'lodash';
import {getUniqueCoordinates} from '../utils/stopUtils';

export const INITIAL_STATE = immutable({
  etaData: [],
  etaFetchTime: null,
  etaFetching: false,
  etaErrorCode: null,
  etaErrorCount: 0
});

const getEtaRequest = (state, action) =>
  state.merge({
    etaFetching: true
  });

const getEtaSuccess = (state, action) => {
  let markers = action.markers ? cloneDeep(action.markers) : [];
  let eta = cloneDeep(action.eta);
  forEach(eta, vehicleData => {
    const vehicleLat = get(vehicleData, 'vehicle_location.lat');
    const vehicleLng = get(vehicleData, 'vehicle_location.lng');
    if (vehicleLat && vehicleLng) {
      const {latitude, longitude} = getUniqueCoordinates(markers, {latitude: vehicleLat, longitude: vehicleLng});
      vehicleData.vehicle_location.lat = latitude;
      vehicleData.vehicle_location.lng = longitude;
      markers.push({latitude, longitude});
    }
  });

  return state.merge({
    etaFetching: false,
    etaErrorCode: null,
    etaErrorCount: 0,
    etaData: eta,
    etaFetchTime: moment().format()
  });
}

const getEtaFailure = (state, action) => 
  state.merge({
    etaFetching: false,
    etaErrorCode: action.errorCode,
    etaErrorCount: state.etaErrorCount + 1
  });

const logout = (state, action) => INITIAL_STATE;

const ACTION_HANDLERS = {
  [types.GET_ETA]: getEtaRequest,
  [types.GET_ETA_SUCCESS]: getEtaSuccess,
  [types.GET_ETA_FAILURE]: getEtaFailure,
  [types.LOGOUT]: logout
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
