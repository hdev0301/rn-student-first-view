import {take, put, call} from 'redux-saga/effects';
import types from '../actions/types';
import actions from '../actions/creators';
import {get} from 'lodash';

function * resetPassword(api, emailOrPhone) {
  const response = yield call(api.resetPassword, emailOrPhone);
  const data = get(response, 'data');
  const statusCode = get(data, 'response.code');
  if (statusCode === 200) {
    yield put(actions.resetPasswordSuccess());
  } else {
    const message = get(data, 'message');
    const errors = get(data, 'errors');
    yield put(actions.resetPasswordFailure(statusCode, errors, message));
  }
}

export function * watchResetPassword(api) {
  while (true) {
    const {emailOrPhone} = yield take(types.RESET_PASSWORD);
    yield call(resetPassword, api, emailOrPhone);
  }
}
