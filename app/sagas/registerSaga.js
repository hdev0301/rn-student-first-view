import {take, put, call} from 'redux-saga/effects';
import types from '../actions/types';
import actions from '../actions/creators';
import {get} from 'lodash';

function * register(api, registrationData) {
  const response = yield call(api.register, registrationData);
  const data = get(response, 'data');
  const message = get(data, 'message');
  const statusCode = get(data, 'response.code');
  if (statusCode === 200) {
    yield put(actions.registerSuccess(message));
  } else {
    const errors = get(data, 'errors');
    yield put(actions.registerFailure(statusCode, errors, message));
  }
}

function * getStatesAndDistricts(api) {
  const response = yield call(api.getStatesAndDistricts);
  const data = get(response, 'data');
  const statusCode = get(data, 'response.code');
  if (statusCode === 200) {
    const statesAndDistricts = get(data, 'result');
    yield put(actions.getStatesAndDistrictsSuccess(statesAndDistricts));
  } else {
    yield put(actions.getStatesAndDistrictsFailure(statusCode));
  }
}

export function * watchRegister(api) {
  while (true) {
    const {registrationData} = yield take(types.REGISTER);
    yield call(register, api, registrationData);
  }
}

export function * watchGetStatesAndDistricts(api) {
  while (true) {
    yield take(types.GET_STATES_AND_DISTRICTS);
    yield call(getStatesAndDistricts, api);
  }
}
