import {take, put, call} from 'redux-saga/effects';
import types from '../actions/types';
import actions from '../actions/creators';
import {authSaga} from './authSaga';
import {get} from 'lodash';

function * getNotificationContacts(api) {
  const response = yield call(authSaga, api.getNotificationContacts);
  const data = get(response, 'data');
  const statusCode = get(data, 'response.code');
  if (statusCode === 200) {
    const notificationContacts = get(data, 'result');
    yield put(actions.getNotificationContactsSuccess(notificationContacts));
  } else {
    yield put(actions.getNotificationContactsFailure(statusCode));
  }
}

function * addNotificationContact(api, contactData) {
  const response = yield call(authSaga, api.addNotificationContact, contactData);
  const data = get(response, 'data');
  const statusCode = get(data, 'response.code');
  if (statusCode === 200) {
    yield put(actions.addNotificationContactSuccess(contactData));
  } else {
    const message = get(data, 'message');
    const errors = get(data, 'errors');
    yield put(actions.addNotificationContactFailure(statusCode, errors, message));
  }
}

function * updateNotificationContact(api, contactData) {
  const response = yield call(authSaga, api.updateNotificationContact, contactData);
  const data = get(response, 'data');
  const statusCode = get(data, 'response.code');
  if (statusCode === 200) {
    yield put(actions.updateNotificationContactSuccess(contactData));
  } else {
    const message = get(data, 'message');
    const errors = get(data, 'errors');
    yield put(actions.updateNotificationContactFailure(statusCode, errors, message));
  }
}

function * removeNotificationContact(api, contactId) {
  const response = yield call(authSaga, api.removeNotificationContact, contactId);
  const data = get(response, 'data');
  const statusCode = get(data, 'response.code');
  if (statusCode === 200) {
    yield put(actions.removeNotificationContactSuccess(contactId));
  } else {
    const message = get(data, 'message');
    yield put(actions.removeNotificationContactFailure(statusCode, message));
  }
}

export function * watchGetNotificationContacts(api) {
  while (true) {
    yield take(types.GET_NOTIFICATION_CONTACTS);
    yield call(getNotificationContacts, api);
  }
}

export function * watchUpdateNotificationContact(api) {
  while (true) {
    const {contactData} = yield take(types.UPDATE_NOTIFICATION_CONTACT);
    yield call(updateNotificationContact, api, contactData);
  }
}

export function * watchAddNotificationContact(api) {
  while (true) {
    const {contactData} = yield take(types.ADD_NOTIFICATION_CONTACT);
    yield call(addNotificationContact, api, contactData);
  }
}

export function * watchRemoveNotificationContact(api) {
  while (true) {
    const {contactId} = yield take(types.REMOVE_NOTIFICATION_CONTACT);
    yield call(removeNotificationContact, api, contactId);
  }
}
