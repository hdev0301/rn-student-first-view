import {take, put, call, fork, cancel} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import types from '../actions/types';
import actions from '../actions/creators';
import env from '../core/env';

function * delayEtaRefresh(s) {
  yield call(delay, 1000);
  let counter = parseInt(s) * 10;
  yield put(actions.etaUpdateCounter(counter / 10));
  while(counter > 0) {
    yield call(delay, 100);
    counter = counter - 1;
    yield put(actions.etaUpdateCounter(counter / 10));
  }
}

function * getStops() {
  yield put(actions.getStudents());
  const studentsAction = yield take([types.GET_STUDENTS_SUCCESS, types.GET_STUDENTS_FAILURE]);
  if (studentsAction.type === types.GET_STUDENTS_SUCCESS) {
    yield put(actions.getEta());
    const etaAction = yield take([types.GET_ETA_SUCCESS, types.GET_ETA_FAILURE]);
    if (etaAction.type === types.GET_ETA_SUCCESS) {
      yield put(actions.getStopsSuccess());
      yield put(actions.startEtaRefreshLoop(true));
    } else if (etaAction.type === types.GET_ETA_FAILURE) {
      yield put(actions.getStopsFailure());
    }
  } else if (studentsAction.type === types.GET_STUDENTS_FAILURE) {
    yield put(actions.getStopsFailure());
  }
}

function * startEtaRefreshLoop(delayed = false) {
  const interval = env.app.etaRefreshInterval;
  if (delayed) {
    yield call(delayEtaRefresh, interval);
  };
  while (true) {
    yield put(actions.getEta());
    const etaAction = yield take([types.GET_ETA_SUCCESS, types.GET_ETA_FAILURE]);
    if (etaAction.type === types.GET_ETA_SUCCESS) {
      yield put(actions.etaRefreshLoopSuccess());
    } else if (etaAction.type === types.GET_ETA_FAILURE) {
      yield put(actions.etaRefreshLoopFailure());
    }
    yield call(delayEtaRefresh, interval);
  }
}

export function * watchGetStops() {
  while (true) {
    yield take(types.GET_STOPS);
    yield call(getStops);
  }
}

export function * watchStartEtaRefreshLoop() {
  while (true) {
    const {delayed} = yield take(types.START_ETA_REFRESH_LOOP);
    const bgStartEtaRefreshLoop = yield fork(startEtaRefreshLoop, delayed);
    yield take([types.GET_STUDENTS, types.STOP_ETA_REFRESH_LOOP]);
    yield cancel(bgStartEtaRefreshLoop);
  }
}
