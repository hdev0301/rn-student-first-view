import types from '../actions/types';
import immutable from 'seamless-immutable';
import {createReducer} from 'reduxsauce';
import {values} from 'lodash';

export const INITIAL_STATE = immutable({
  notificationPreferencesData: [],
  notificationPreferencesFetching: false,
  notificationPreferencesErrorCode: null,
  notificationPreferenceAddSubmitting: false,
  notificationPreferenceAddErrorCode: null,
  notificationPreferenceAddErrorMessage: null,
  notificationPreferenceUpdateSubmitting: false,
  notificationPreferenceUpdateErrorCode: null,
  notificationPreferenceUpdateErrorMessage: null,
  notificationPreferenceRemoveSubmitting: false,
  notificationPreferenceRemoveErrorCode: null,
  notificationPreferenceRemoveErrorMessage: null,
});

const getNotificationPreferencesRequest = (state, action) =>
  state.merge({
    notificationPreferencesFetching: true
  });

const getNotificationPreferencesSuccess = (state, action) => 
  state.merge({
    notificationPreferencesFetching: false,
    notificationPreferencesErrorCode: null,
    notificationPreferencesData: action.notificationPreferences,
  });

const getNotificationPreferencesFailure = (state, action) =>
  state.merge({
    notificationPreferencesFetching: false,
    notificationPreferencesErrorCode: action.errorCode,
    notificationPreferencesData: []
  });

const addNotificationPreferenceRequest = (state, action) =>
  state.merge({
    notificationPreferenceAddSubmitting: true,
    notificationPreferenceAddErrorCode: null,
    notificationPreferenceAddErrorMessage: null
  });

const addNotificationPreferenceSuccess = (state, action) =>
  state.merge({
    notificationPreferenceAddSubmitting: false,
    notificationPreferenceAddErrorCode: null,
    notificationPreferenceAddErrorMessage: null
  });

const addNotificationPreferenceFailure = (state, action) =>
  state.merge({
    notificationPreferenceAddSubmitting: false,
    notificationPreferenceAddErrorCode: action.errorCode,
    notificationPreferenceAddErrorMessage: action.errors ? values(action.errors).join('. ') : action.message
  });

const updateNotificationPreferenceRequest = (state, action) =>
  state.merge({
    notificationPreferenceUpdateSubmitting: true,
    notificationPreferenceUpdateErrorCode: null,
    notificationPreferenceUpdateErrorMessage: null
  });

const updateNotificationPreferenceSuccess = (state, action) =>
  state.merge({
    notificationPreferenceUpdateSubmitting: false,
    notificationPreferenceUpdateErrorCode: null,
    notificationPreferenceUpdateErrorMessage: null
  });

const updateNotificationPreferenceFailure = (state, action) =>
  state.merge({
    notificationPreferenceUpdateSubmitting: false,
    notificationPreferenceUpdateErrorCode: action.errorCode,
    notificationPreferenceUpdateErrorMessage: action.errors ? values(action.errors).join('. ') : action.message
  });

const removeNotificationPreferenceRequest = (state, action) =>
  state.merge({
    notificationPreferenceRemoveSubmitting: true,
    notificationPreferenceRemoveErrorCode: null,
    notificationPreferenceRemoveErrorMessage: null
  });

const removeNotificationPreferenceSuccess = (state, action) =>
  state.merge({
    notificationPreferenceRemoveSubmitting: false,
    notificationPreferenceRemoveErrorCode: null,
    notificationPreferenceRemoveErrorMessage: null
  });

const removeNotificationPreferenceFailure = (state, action) => 
  state.merge({
    notificationPreferenceRemoveSubmitting: false,
    notificationPreferenceRemoveErrorCode: action.errorCode,
    notificationPreferenceRemoveErrorMessage: action.message
  });

const logout = (state, action) => INITIAL_STATE;

const ACTION_HANDLERS = {
  [types.GET_NOTIFICATION_PREFERENCES]: getNotificationPreferencesRequest,
  [types.GET_NOTIFICATION_PREFERENCES_SUCCESS]: getNotificationPreferencesSuccess,
  [types.GET_NOTIFICATION_PREFERENCES_FAILURE]: getNotificationPreferencesFailure,
  [types.ADD_NOTIFICATION_PREFERENCE]: addNotificationPreferenceRequest,
  [types.ADD_NOTIFICATION_PREFERENCE_SUCCESS]: addNotificationPreferenceSuccess,
  [types.ADD_NOTIFICATION_PREFERENCE_FAILURE]: addNotificationPreferenceFailure,
  [types.UPDATE_NOTIFICATION_PREFERENCE]: updateNotificationPreferenceRequest,
  [types.UPDATE_NOTIFICATION_PREFERENCE_SUCCESS]: updateNotificationPreferenceSuccess,
  [types.UPDATE_NOTIFICATION_PREFERENCE_FAILURE]: updateNotificationPreferenceFailure,
  [types.REMOVE_NOTIFICATION_PREFERENCE]: removeNotificationPreferenceRequest,
  [types.REMOVE_NOTIFICATION_PREFERENCE_SUCCESS]: removeNotificationPreferenceSuccess,
  [types.REMOVE_NOTIFICATION_PREFERENCE_FAILURE]: removeNotificationPreferenceFailure,
  [types.LOGOUT]: logout
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
