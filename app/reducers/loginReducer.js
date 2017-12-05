import types from '../actions/types';
import immutable from 'seamless-immutable';
import {createReducer} from 'reduxsauce';
import {isEmpty, values} from 'lodash';

export const INITIAL_STATE = immutable({
  loginSubmitting: false,
  loginErrorCode: null,
  loginErrorMessage: null,
  loginProblem: null,
  tokenFetching: false,
  tokenErrorCode: null,
  tokenProblem: null,
  authToken: null
});

const loginRequest = (state, action) =>
  state.merge({
    loginSubmitting: true,
    loginErrorCode: null,
    loginErrorMessage: null
  });

const loginSuccess = (state, action) =>
  state.merge({
    loginSubmitting: false,
    tokenFetching: true,
    loginErrorCode: null,
    loginErrorMessage: null,
    loginProblem: null
  });

const loginFailure = (state, action) =>
  state.merge({
    loginSubmitting: false,
    loginErrorCode: action.errorCode,
    loginErrorMessage: !isEmpty(action.errors) ? `${values(action.errors).join('. ')}.` : action.message,
    loginProblem: action.problem,
    authToken: null
  });

const getTokenRequest = (state, action) =>
  state.merge({
    tokenFetching: true,
    tokenErrorCode: null
  });

const getTokenSuccess = (state, action) =>
  state.merge({
    tokenFetching: false,
    tokenErrorCode: null,
    tokenProblem: null,
    authToken: action.authToken
  });

const getTokenFailure = (state, action) =>
  state.merge({
    tokenFetching: false,
    tokenErrorCode: action.errorCode,
    tokenProblem: action.problem,
    authToken: null
  });

const logout = (state, action) => INITIAL_STATE;

const ACTION_HANDLERS = {
  [types.LOGIN]: loginRequest,
  [types.LOGIN_SUCCESS]: loginSuccess,
  [types.LOGIN_FAILURE]: loginFailure,
  [types.GET_TOKEN]: getTokenRequest,
  [types.GET_TOKEN_SUCCESS]: getTokenSuccess,
  [types.GET_TOKEN_FAILURE]: getTokenFailure,
  [types.LOGOUT]: logout
}

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
