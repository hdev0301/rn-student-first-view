import types from '../actions/types';
import immutable from 'seamless-immutable';
import {createReducer} from 'reduxsauce';

export const INITIAL_STATE = immutable({
  notificationsData: [],
  notificationsFetching: false,
  notificationsErrorCode: null,
  notificationRemoveSubmitting: false,
  notificationRemoveErrorCode: null,
  notificationRemoveErrorMessage: null
});

const getNotificationsRequest = (state, action) =>
  state.merge({
    notificationsFetching: true
  });

const getNotificationsSuccess = (state, action) =>
  state.merge({
    notificationsFetching: false,
    notificationsErrorCode: null,
    notificationsData: action.notificationsData
  });

const getNotificationsFailure = (state, action) =>
  state.merge({
    notificationsFetching: false,
    notificationsErrorCode: action.errorCode,
    notificationsData: [],
  });

const removeNotificationRequest = (state, action) =>
  state.merge({
    notificationRemoveSubmitting: true,
    notificationRemoveErrorCode: null,
    notificationRemoveErrorMessage: null
  });

const removeNotificationSuccess = (state, action) =>
  state.merge({
    notificationRemoveSubmitting: false,
    notificationRemoveErrorCode: null,
    notificationRemoveErrorMessage: null
  });

const removeNotificationFailure = (state, action) =>
  state.merge({
    notificationRemoveSubmitting: false,
    notificationRemoveErrorCode: action.errorCode,
    notificationRemoveErrorMessage: action.message
  });

const logout = (state, action) => INITIAL_STATE;

const ACTION_HANDLERS = {
  [types.GET_NOTIFICATIONS]: getNotificationsRequest,
  [types.GET_NOTIFICATIONS_SUCCESS]: getNotificationsSuccess,
  [types.GET_NOTIFICATIONS_FAILURE]: getNotificationsFailure,
  [types.REMOVE_NOTIFICATION]: removeNotificationRequest,
  [types.REMOVE_NOTIFICATION_SUCCESS]: removeNotificationSuccess,
  [types.REMOVE_NOTIFICATION_FAILURE]: removeNotificationFailure,
  [types.LOGOUT]: logout
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
