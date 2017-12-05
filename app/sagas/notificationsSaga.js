import {take, put, call} from 'redux-saga/effects';
import types from '../actions/types';
import actions from '../actions/creators';
import {authSaga} from './authSaga';
import {get} from 'lodash';

function * getNotifications(api) {
  const response = yield call(authSaga, api.getNotifications);
  const data = get(response, 'data');
  const statusCode = get(data, 'response.code');
  if (statusCode === 200) {
    const notifications = get(data, 'result');
    yield put(actions.getNotificationsSuccess(notifications));
  } else {
    yield put(actions.getNotificationsFailure(statusCode));
  }
}

function * removeNotification(api, notificationId) {
  const response = yield call(authSaga, api.removeNotification, notificationId);
  const data = get(response, 'data');
  const statusCode = get(data, 'response.code');
  if (statusCode === 200) {
    yield put(actions.removeNotificationSuccess(notificationId));
  } else {
    const message = get(data, 'message');
    yield put(actions.removeNotificationFailure(statusCode, message));
  }
}

export function * watchGetNotifications(api) {
  while (true) {
    yield take(types.GET_NOTIFICATIONS);
    yield call(getNotifications, api);
  }
}

export function * watchRemoveNotification(api) {
  while (true) {
    const {notificationId} = yield take(types.REMOVE_NOTIFICATION);
    yield call(removeNotification, api, notificationId);
  }
}
