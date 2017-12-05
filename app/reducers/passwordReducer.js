import types from '../actions/types';
import immutable from 'seamless-immutable';
import {createReducer} from 'reduxsauce';
import {values} from 'lodash';

export const INITIAL_STATE = immutable({
  resetPasswordSubmitting: false,
  resetPasswordErrorCode: null,
  resetPasswordErrorMessage: null
});

const resetPasswordRequest = (state, action) =>
  state.merge({
    resetPasswordSubmitting: true,
    resetPasswordErrorCode: null,
    resetPasswordErrorMessage: null
  });

const resetPasswordSuccess = (state, action) =>
  state.merge({
    resetPasswordSubmitting: false,
    resetPasswordErrorCode: null,
    resetPasswordErrorMessage: null
  });

const resetPasswordFailure = (state, action) =>
  state.merge({
    resetPasswordSubmitting: false,
    resetPasswordErrorCode: action.errorCode,
    resetPasswordErrorMessage: action.errors ? values(action.errors).join('. ') : action.message
  });

const logout = (state, action) => INITIAL_STATE;

const ACTION_HANDLERS = {
  [types.RESET_PASSWORD]: resetPasswordRequest,
  [types.RESET_PASSWORD_SUCCESS]: resetPasswordSuccess,
  [types.RESET_PASSWORD_FAILURE]: resetPasswordFailure,
  [types.LOGOUT]: logout
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
