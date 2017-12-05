import {take, put, call, select} from 'redux-saga/effects';
import types from '../actions/types';
import actions from '../actions/creators';
import {get} from 'lodash';

function * signIn(api, emailOrPhone, password) {
  const response = yield call(api.signIn, emailOrPhone, password);
  const problem = get(response, 'problem');
  const data = get(response, 'data');
  let statusCode = get(data, 'response.code');
  if (statusCode === 200) {
    const loginToken = get(data, 'login_token');
    yield put(actions.getToken(emailOrPhone, loginToken));
    const tokenAction = yield take([types.GET_TOKEN_SUCCESS, types.GET_TOKEN_FAILURE]);
    if (tokenAction.type === types.GET_TOKEN_SUCCESS) {
      yield put(actions.loginSuccess(emailOrPhone, loginToken));
    } else if (tokenAction.type === types.GET_TOKEN_FAILURE) {
      statusCode = yield select((state) => state.login.tokenErrorCode);
      yield put(actions.loginFailure(statusCode));
    }
  } else {
    const errors = get(data, 'errors');
    const message = get(data, 'message');
    yield put(actions.loginFailure(statusCode, errors, message, problem));
  }
}

export function * watchLogin(api) {
  while (true) {
    const {emailOrPhone, password} = yield take(types.LOGIN);
    yield call(signIn, api, emailOrPhone, password);
  }
}
