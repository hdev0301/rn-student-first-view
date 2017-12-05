import types from '../actions/types';
import immutable from 'seamless-immutable';
import {createReducer} from 'reduxsauce';

export const INITIAL_STATE = immutable({
  registerPushSubmitting: false,
  registerPushErrorCode: null,
  registerPushErrorMessage: null
});

const registerPushRequest = (state, action) =>
  state.merge({
    registerPushSubmitting: true,
    registerPushErrorCode: null,
    registerPushErrorMessage: null
  });

const registerPushSuccess = (state, action) =>
  state.merge({
    registerPushSubmitting: false,
    registerPushErrorCode: null,
    registerPushErrorMessage: null
  });

const registerPushFailure = (state, action) =>
  state.merge({
    registerPushSubmitting: false,
    registerPushErrorCode: action.errorCode,
    registerPushErrorMessage: action.message
  });

const logout = (state, action) => INITIAL_STATE;

const ACTION_HANDLERS = {
  [types.REGISTER_PUSH]: registerPushRequest,
  [types.REGISTER_PUSH_SUCCESS]: registerPushSuccess,
  [types.REGISTER_PUSH_FAILURE]: registerPushFailure,
  [types.LOGOUT]: logout
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
