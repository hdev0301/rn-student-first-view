import {take, put, call} from 'redux-saga/effects';
import types from '../actions/types';
import actions from '../actions/creators';
import {authSaga} from './authSaga';
import {get} from 'lodash';

function * getProfile(api) {
  const response = yield call(authSaga, api.getProfile);
  const data = get(response, 'data');
  const statusCode = get(data, 'response.code');
  if (statusCode === 200) {
    const profile = get(data, 'result');
    yield put(actions.getProfileSuccess(profile));
  } else {
    yield put(actions.getProfileFailure(statusCode));
  }
}

function * updateProfile(api, profileData) {
  const response = yield call(authSaga, api.updateProfile, profileData);
  const data = get(response, 'data');
  const statusCode = get(data, 'response.code');
  if (statusCode === 200) {
    const profile = get(data, 'result');
    yield put(actions.updateProfileSuccess(profile));
  } else {
    const message = get(data, 'message');
    const errors = get(data, 'errors');
    yield put(actions.updateProfileFailure(statusCode, errors, message));
  }
}

export function * watchGetProfile(api) {
  while (true) {
    yield take(types.GET_PROFILE);
    yield call(getProfile, api);
  }
}

export function * watchUpdateProfile(api) {
  while (true) {
    const {profileData} = yield take(types.UPDATE_PROFILE);
    yield call(updateProfile, api, profileData);
  }
}
