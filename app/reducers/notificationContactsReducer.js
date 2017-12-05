import types from '../actions/types';
import immutable from 'seamless-immutable';
import {createReducer} from 'reduxsauce';
import {values} from 'lodash';

export const INITIAL_STATE = immutable({
  notificationContactsData: [],
  notificationContactsFetching: false,
  notificationContactsErrorCode: null,
  notificationContactAddSubmitting: false,
  notificationContactAddErrorCode: null,
  notificationContactAddErrorMessage: null,
  notificationContactUpdateSubmitting: false,
  notificationContactUpdateErrorCode: null,
  notificationContactUpdateErrorMessage: null,
  notificationContactRemoveSubmitting: false,
  notificationContactRemoveErrorCode: null,
  notificationContactRemoveErrorMessage: null,
});

const getNotificationContactsRequest = (state, action) =>
  state.merge({
    notificationContactsFetching: true
  });

const getNotificationContactsSuccess = (state, action) => 
  state.merge({
    notificationContactsFetching: false,
    notificationContactsErrorCode: null,
    notificationContactsData: action.notificationContacts,
  });

const getNotificationContactsFailure = (state, action) =>
  state.merge({
    notificationContactsFetching: false,
    notificationContactsErrorCode: action.errorCode,
    notificationContactsData: []
  });

const addNotificationContactRequest = (state, action) =>
  state.merge({
    notificationContactAddSubmitting: true,
    notificationContactAddErrorCode: null,
    notificationContactAddErrorMessage: null
  });

const addNotificationContactSuccess = (state, action) =>
  state.merge({
    notificationContactAddSubmitting: false,
    notificationContactAddErrorCode: null,
    notificationContactAddErrorMessage: null
  });

const addNotificationContactFailure = (state, action) =>
  state.merge({
    notificationContactAddSubmitting: false,
    notificationContactAddErrorCode: action.errorCode,
    notificationContactAddErrorMessage: action.errors ? values(action.errors).join('. ') : action.message
  });

const updateNotificationContactRequest = (state, action) =>
  state.merge({
    notificationContactUpdateSubmitting: true,
    notificationContactUpdateErrorCode: null,
    notificationContactUpdateErrorMessage: null
  });

const updateNotificationContactSuccess = (state, action) =>
  state.merge({
    notificationContactUpdateSubmitting: false,
    notificationContactUpdateErrorCode: null,
    notificationContactUpdateErrorMessage: null
  });

const updateNotificationContactFailure = (state, action) =>
  state.merge({
    notificationContactUpdateSubmitting: false,
    notificationContactUpdateErrorCode: action.errorCode,
    notificationContactUpdateErrorMessage: action.errors ? values(action.errors).join('. ') : action.message
  });

const removeNotificationContactRequest = (state, action) =>
  state.merge({
    notificationContactRemoveSubmitting: true,
    notificationContactRemoveErrorCode: null,
    notificationContactRemoveErrorMessage: null
  });

const removeNotificationContactSuccess = (state, action) =>
  state.merge({
    notificationContactRemoveSubmitting: false,
    notificationContactRemoveErrorCode: null,
    notificationContactRemoveErrorMessage: null
  });

const removeNotificationContactFailure = (state, action) => 
  state.merge({
    notificationContactRemoveSubmitting: false,
    notificationContactRemoveErrorCode: action.errorCode,
    notificationContactRemoveErrorMessage: action.message
  });

const logout = (state, action) => INITIAL_STATE;

const ACTION_HANDLERS = {
  [types.GET_NOTIFICATION_CONTACTS]: getNotificationContactsRequest,
  [types.GET_NOTIFICATION_CONTACTS_SUCCESS]: getNotificationContactsSuccess,
  [types.GET_NOTIFICATION_CONTACTS_FAILURE]: getNotificationContactsFailure,
  [types.ADD_NOTIFICATION_CONTACT]: addNotificationContactRequest,
  [types.ADD_NOTIFICATION_CONTACT_SUCCESS]: addNotificationContactSuccess,
  [types.ADD_NOTIFICATION_CONTACT_FAILURE]: addNotificationContactFailure,
  [types.UPDATE_NOTIFICATION_CONTACT]: updateNotificationContactRequest,
  [types.UPDATE_NOTIFICATION_CONTACT_SUCCESS]: updateNotificationContactSuccess,
  [types.UPDATE_NOTIFICATION_CONTACT_FAILURE]: updateNotificationContactFailure,
  [types.REMOVE_NOTIFICATION_CONTACT]: removeNotificationContactRequest,
  [types.REMOVE_NOTIFICATION_CONTACT_SUCCESS]: removeNotificationContactSuccess,
  [types.REMOVE_NOTIFICATION_CONTACT_FAILURE]: removeNotificationContactFailure,
  [types.LOGOUT]: logout
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
