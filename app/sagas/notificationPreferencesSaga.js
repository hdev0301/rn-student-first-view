import {take, put, call} from 'redux-saga/effects';
import types from '../actions/types';
import actions from '../actions/creators';
import {authSaga} from './authSaga';
import {get} from 'lodash';

function * getNotificationPreferences(api) {
  const response = yield call(authSaga, api.getNotificationPreferences);
  const data = get(response, 'data');
  const statusCode = get(data, 'response.code');
  if (statusCode === 200) {
    const notificationPreferences = get(data, 'result');
    yield put(actions.getNotificationPreferencesSuccess(notificationPreferences));
  } else {
    yield put(actions.getNotificationPreferencesFailure(statusCode));
  }
}

function * addNotificationPreference(api, preferenceData) {
  const response = yield call(authSaga, api.addNotificationPreference, preferenceData);
  const data = get(response, 'data');
  const statusCode = get(data, 'response.code');
  if (statusCode === 200) {
    yield put(actions.addNotificationPreferenceSuccess(preferenceData));
  } else {
    const message = get(data, 'message');
    const errors = get(data, 'errors');
    yield put(actions.addNotificationPreferenceFailure(statusCode, errors, message));
  }
}

function * updateNotificationPreference(api, preferenceData) {
  const response = yield call(authSaga, api.updateNotificationPreference, preferenceData);
  const data = get(response, 'data');
  const statusCode = get(data, 'response.code');
  if (statusCode === 200) {
    yield put(actions.updateNotificationPreferenceSuccess(preferenceData));
  } else {
    const message = get(data, 'message');
    const errors = get(data, 'errors');
    yield put(actions.updateNotificationPreferenceFailure(statusCode, errors, message));
  }
}

function * removeNotificationPreference(api, preferenceId) {
  const response = yield call(authSaga, api.removeNotificationPreference, preferenceId);
  const data = get(response, 'data');
  const statusCode = get(data, 'response.code');
  if (statusCode === 200) {
    yield put(actions.removeNotificationPreferenceSuccess(preferenceId));
  } else {
    const message = get(data, 'message');
    yield put(actions.removeNotificationPreferenceFailure(statusCode, message));
  }
}

export function * watchGetNotificationPreferences(api) {
  while (true) {
    yield take(types.GET_NOTIFICATION_PREFERENCES);
    yield call(getNotificationPreferences, api);
  }
}

export function * watchUpdateNotificationPreference(api) {
  while (true) {
    const {preferenceData} = yield take(types.UPDATE_NOTIFICATION_PREFERENCE);
    yield call(updateNotificationPreference, api, preferenceData);
  }
}

export function * watchAddNotificationPreference(api) {
  while (true) {
    const {preferenceData} = yield take(types.ADD_NOTIFICATION_PREFERENCE);
    yield call(addNotificationPreference, api, preferenceData);
  }
}

export function * watchRemoveNotificationPreference(api) {
  while (true) {
    const {preferenceId} = yield take(types.REMOVE_NOTIFICATION_PREFERENCE);
    yield call(removeNotificationPreference, api, preferenceId);
  }
}
