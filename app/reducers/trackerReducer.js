import types from '../actions/types';
import immutable from 'seamless-immutable';
import {createReducer} from 'reduxsauce';
import {colors} from '../themes';
import {direction} from '../components/BusIcon';

export const INITIAL_STATE = immutable({
  stopsFetching: false,
  stopsError: false,
  etaRefreshError: false,
  etaUpdateCounter: null
});

const getStopsRequest = state =>
  state.merge({
    stopsFetching: true
  });

const getStopsSuccess = state =>
  state.merge({
    stopsFetching: false,
    stopsError: false
  });

const getStopsFailure = state =>
  state.merge({
    stopsFetching: false,
    stopsError: true
  });

const startEtaRefreshLoop = state =>
  state.merge({
    etaRefreshError: false
  });

const stopEtaRefreshLoop = state =>
  state.merge({
    etaRefreshError: false,
    etaUpdateCounter: null
  });

const etaUpdateCounter = (state, action) =>
  state.merge({
    etaUpdateCounter: action.counter
  });

const etaRefreshLoopSuccess = state =>
  state.merge({
    etaRefreshError: false
  });

const etaRefreshLoopFailure = state =>
  state.merge({
    etaRefreshError: true
  });

const logout = (state, action) => INITIAL_STATE;

const ACTION_HANDLERS = {
  [types.GET_STOPS]: getStopsRequest,
  [types.GET_STOPS_SUCCESS]: getStopsSuccess,
  [types.GET_STOPS_FAILURE]: getStopsFailure,
  [types.ETA_REFRESH_LOOP_SUCCESS]: etaRefreshLoopSuccess,
  [types.ETA_REFRESH_LOOP_FAILURE]: etaRefreshLoopFailure,
  [types.START_ETA_REFRESH_LOOP]: startEtaRefreshLoop,
  [types.STOP_ETA_REFRESH_LOOP]: stopEtaRefreshLoop,
  [types.ETA_UPDATE_COUNTER]: etaUpdateCounter,
  [types.LOGOUT]: logout
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
