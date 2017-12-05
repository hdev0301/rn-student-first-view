import {take, put, call, select} from 'redux-saga/effects';
import types from '../actions/types';
import actions from '../actions/creators';
import {authSaga} from './authSaga';
import {get} from 'lodash';
import polyline from '@mapbox/polyline';

function * getEta(api) {
  const response = yield call(authSaga, api.getEta);
  const data = get(response, 'data');
  const statusCode = get(data, 'response.code');
  if (statusCode === 200) {
    const eta = get(data, 'result');
    const markers = yield select((state) => state.students.markers);
    yield put(actions.getEtaSuccess(eta, markers));
  } else {
    yield put(actions.getEtaFailure(statusCode));
  }
}

export function * watchGetEta(api) {
  while (true) {
    yield take(types.GET_ETA);
    yield call(getEta, api);
  }
}