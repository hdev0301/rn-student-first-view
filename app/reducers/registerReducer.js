import types from '../actions/types';
import immutable from 'seamless-immutable';
import {createReducer} from 'reduxsauce';
import {map, forIn, camelCase, values, isEmpty} from 'lodash';

export const INITIAL_STATE = immutable({
  states: [],
  districts: {},
  statesAndDistrictsFetching: false,
  statesAndDistrictsErrorCode: null,
  registrationSubmitting: null,
  registrationErrorCode: null,
  registrationErrors: null,
  registrationErrorMessage: null,
  registrationSuccessMessage: null
});

const getStatesAndDistrictsRequest = (state, action) =>
  state.merge({
    statesAndDistrictsFetching: true,
    states: [],
    districts: {}
  });

const getStatesAndDistrictsSuccess = (state, action) =>
  state.merge({
    statesAndDistrictsFetching: false,
    statesAndDistrictsErrorCode: null,
    states: map(action.statesAndDistricts, (stateAndDistricts) => ({id: stateAndDistricts.id, name: stateAndDistricts.name})),
    districts: Object.assign(...map(action.statesAndDistricts, (stateAndDistricts) => ({[stateAndDistricts.id]: stateAndDistricts.districts})))
  });

const getStatesAndDistrictsFailure = (state, action) =>
  state.merge({
    statesAndDistrictsFetching: false,
    statesAndDistrictsErrorCode: true,
    states: [],
    districts: {}
  });

const registerRequest = (state, action) =>
  state.merge({
    registrationSubmitting: true,
    registrationErrorCode: null,
    registrationErrors: null,
    registrationErrorMessage: null,
    registrationSuccessMessage: null
  });

const registerSuccess = (state, action) =>
  state.merge({
    registrationSubmitting: false,
    registrationErrorCode: null,
    registrationErrors: null,
    registrationErrorMessage: null,
    registrationSuccessMessage: action.message
  });

const registerFailure = (state, action) => {
  let camelCasedErrors = {};
  forIn(action.errors, (value, key) => camelCasedErrors[camelCase(key)] = value);

  return state.merge({
    registrationSubmitting: false,
    registrationErrorCode: action.errorCode,
    registrationErrors: !isEmpty(camelCasedErrors) ? camelCasedErrors : null,
    registrationErrorMessage: !isEmpty(action.errors) ? `${values(action.errors).join('. ')}.` : action.message,
    registrationSuccessMessage: null
  });
}


const clearRegistrationSuccessMessageRequest = (state, action) =>
  state.merge({
    registrationSuccessMessage: null
  });

const logout = (state, action) => INITIAL_STATE;

const ACTION_HANDLERS = {
  [types.GET_STATES_AND_DISTRICTS]: getStatesAndDistrictsRequest,
  [types.GET_STATES_AND_DISTRICTS_SUCCESS]: getStatesAndDistrictsSuccess,
  [types.GET_STATES_AND_DISTRICTS_FAILURE]: getStatesAndDistrictsFailure,
  [types.REGISTER]: registerRequest,
  [types.REGISTER_SUCCESS]: registerSuccess,
  [types.REGISTER_FAILURE]: registerFailure,
  [types.CLEAR_REGISTRATION_SUCCESS_MESSAGE]: clearRegistrationSuccessMessageRequest,
  [types.LOGOUT]: logout
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
