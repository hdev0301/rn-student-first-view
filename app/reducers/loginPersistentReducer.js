import types from '../actions/types';
import immutable from 'seamless-immutable';
import {createReducer} from 'reduxsauce';

export const INITIAL_STATE = immutable({
  emailOrPhone: null,
  loginToken: null
});

const loginSuccess = (state, action) =>
  state.merge({
    emailOrPhone: action.emailOrPhone,
    loginToken: action.loginToken
  });

const loginFailure = (state, action) =>
  state.merge({
    emailOrPhone: null,
    loginToken: null
  });

const tokenSuccess = (state, action) =>
  state.merge({
    emailOrPhone: action.emailOrPhone
  });

const tokenFailure = (state, action) =>
  state.merge({
    emailOrPhone: null,
    loginToken: null
  });

const logout = (state, action) => INITIAL_STATE;

const ACTION_HANDLERS = {
  [types.LOGIN_SUCCESS]: loginSuccess,
  [types.LOGIN_FAILURE]: loginFailure,
  [types.GET_TOKEN_SUCCESS]: tokenSuccess,
  [types.GET_TOKEN_FAILURE]: tokenFailure,
  [types.LOGOUT]: logout
}

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
