import types from '../actions/types';
import immutable from 'seamless-immutable';
import {createReducer} from 'reduxsauce';
import {values} from 'lodash';

export const INITIAL_STATE = immutable({
  profileData: {},
  profileFetching: false,
  profileError: null,
  profileUpdateSubmitting: false,
  profileUpdateErrorCode: null,
  profileUpdateErrorMessage: null
});

const getProfileRequest = (state, action) =>
  state.merge({
    profileFetching: true
  });

const getProfileSuccess = (state, action) =>
  state.merge({
    profileFetching: false,
    profileError: null,
    profileData: action.profile
  });

const getProfileFailure = (state, action) =>
  state.merge({
    profileFetching: false,
    profileError: true,
    profileData: {}
  });

const updateProfileRequest = (state, action) =>
  state.merge({
    profileUpdateSubmitting: true,
    profileUpdateErrorCode: null,
    profileUpdateErrorMessage: null
  });

const updateProfileSuccess = (state, action) =>
  state.merge({
    profileUpdateSubmitting: false,
    profileUpdateErrorCode: null,
    profileUpdateErrorMessage: null
  });

const updateProfileFailure = (state, action) =>
  state.merge({
    profileUpdateSubmitting: false,
    profileUpdateErrorCode: action.errorCode,
    profileUpdateErrorMessage: action.errors ? values(action.errors).join('. ') : action.message
  });

const logout = (state, action) => INITIAL_STATE;

const ACTION_HANDLERS = {
  [types.GET_PROFILE]: getProfileRequest,
  [types.GET_PROFILE_SUCCESS]: getProfileSuccess,
  [types.GET_PROFILE_FAILURE]: getProfileFailure,
  [types.UPDATE_PROFILE]: updateProfileRequest,
  [types.UPDATE_PROFILE_SUCCESS]: updateProfileSuccess,
  [types.UPDATE_PROFILE_FAILURE]: updateProfileFailure,
  [types.LOGOUT]: logout
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
