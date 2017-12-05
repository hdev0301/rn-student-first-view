import {Alert} from 'react-native';
import {take, spawn, call, put, select} from 'redux-saga/effects';
import {eventChannel, delay} from 'redux-saga';
import OneSignal from 'react-native-onesignal';
import types from '../actions/types';
import actions from '../actions/creators';
import {get} from 'lodash';

function * viewOneSignalDevice(oneSignalApi, pushId) {
  const response = yield call(oneSignalApi.viewDevice, pushId);
  const statusCode = get(response, 'status');  
  if (statusCode === 200) {
    const device = get(response, 'data');
    yield put(actions.viewOneSignalDeviceSuccess(device));
  } else {
    const errors = get(response, 'data.errors');    
    yield put(actions.viewOneSignalDeviceFailure(statusCode, errors));
  }
}

export function * watchSubscribeToOneSignal() {
    while (true) {
      yield take(types.SUBSCRIBE_TO_ONE_SIGNAL);
      yield spawn(OneSignal.setSubscription, true);
      /*yield call(delay, 5000);
      const pushId = yield select((state) => state.oneSignal.pushId);
      yield put(actions.viewOneSignalDevice(pushId));*/
    }
}

export function * watchUnsubscribeFromOneSignal() {
  while (true) {
    yield take(types.UNSUBSCRIBE_FROM_ONE_SIGNAL);
    yield spawn(OneSignal.setSubscription, false);
    /*yield call(delay, 5000);
    const pushId = yield select((state) => state.oneSignal.pushId);
    yield put(actions.viewOneSignalDevice(pushId));*/
  }
}

export function * watchViewOneSignalDevice(oneSignalApi) {
  while (true) {
    const {pushId} = yield take(types.VIEW_ONE_SIGNAL_DEVICE);
    yield call(viewOneSignalDevice, oneSignalApi, pushId);
  }
}

function createOneSignalChannel() {
  let emitEnabled = true;
  return eventChannel(emit => {
      OneSignal.configure({
        onIdsAvailable: ids => emitEnabled && emit({onIdsAvailable: {ids}}),
        onNotificationOpened: (message, data, isActive) => emitEnabled && emit({onNotificationOpened: {message, data, isActive}})
      });
      return () => {
        emitEnabled = false;
      }
    }
  )
}

export function * watchOneSignalEvents() {
  const oneSignalChannel = yield call(createOneSignalChannel);
  while (true) {
    const payload = yield take(oneSignalChannel);
    if (payload.onIdsAvailable) {
      const ids = get(payload, 'onIdsAvailable.ids');
      yield put(actions.oneSignalIdsAvailable(ids));      
    } else if (payload.onNotificationOpened) {
      const title = get(payload, 'onNotificationOpened.data.title');
      const message = get(payload, 'onNotificationOpened.message');
      yield call(Alert.alert, title, message);
    }
  }
}
