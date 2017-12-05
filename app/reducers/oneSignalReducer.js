import types from '../actions/types';
import immutable from 'seamless-immutable';
import {createReducer} from 'reduxsauce';
import {get} from 'lodash';

export const INITIAL_STATE = immutable({
  pushId: null,
  pushIdInvalid: true,
  viewOneSignalDeviceFetching: false,
  viewOneSignalDeviceErrorCode: null
});

const oneSignalIdsAvailable = (state, action) =>
  state.merge({
    pushId: get(action, 'ids.userId'),
  });

const viewOneSignalDeviceRequest = (state, action) =>
  state.merge({
    viewOneSignalDeviceFetching: true,
    viewOneSignalDeviceErrorCode: null,
    viewOneSignalDeviceErrorMessage: null
  });

const viewOneSignalDeviceSuccess = (state, action) =>
  state.merge({
    viewOneSignalDeviceFetching: false,
    viewOneSignalDeviceErrorCode: null,
    viewOneSignalDeviceErrorMessage: null,
    pushIdInvalid: get(action, 'device.invalid_identifier')
  });

const viewOneSignalDeviceFailure = (state, action) =>
  state.merge({
    viewOneSignalDeviceFetching: false,
    viewOneSignalDeviceErrorCode: action.errorCode,
    viewOneSignalDeviceErrorMessage: action.errors && errors.join('. '),
    pushIdInvalid: true,
  });

const logout = (state, action) => immutable({
    ...INITIAL_STATE,
    pushId: state.pushId
});

const ACTION_HANDLERS = {
  [types.ONE_SIGNAL_IDS_AVAILABLE]: oneSignalIdsAvailable,
  [types.VIEW_ONE_SIGNAL_DEVICE]: viewOneSignalDeviceRequest,
  [types.VIEW_ONE_SIGNAL_DEVICE_SUCCESS]: viewOneSignalDeviceSuccess,
  [types.VIEW_ONE_SIGNAL_DEVICE_FAILURE]: viewOneSignalDeviceFailure,
  [types.LOGOUT]: logout
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);