import {take, put, call, select} from 'redux-saga/effects';
import types from '../actions/types';
import actions from '../actions/creators';
import {get} from 'lodash';

function * getToken(api, emailOrPhone, loginToken) {
  const response = yield call(api.getToken, emailOrPhone, loginToken);
  const problem = get(response, 'problem');
  const data = get(response, 'data');
  const statusCode = get(data, 'response.code');
  if (statusCode === 200) {
    const authToken = get(data, 'auth_token');
    yield put(actions.getTokenSuccess(emailOrPhone, authToken));
    return authToken;
  } else {
    yield put(actions.getTokenFailure(statusCode, problem));
    return null;
  }
}

function * apiCall(apiFn, apiParams = {}) {
  const authToken = yield select((state) => state.login.authToken);
  return yield call(apiFn, authToken, apiParams);
}

export function * authSaga(apiFn, apiParams = {}) {
  let response = yield call(apiCall, apiFn, apiParams);
  const statusCode = get(response, 'data.response.code');
  if (statusCode === 401) {
    const {emailOrPhone, loginToken} = yield select((state) => state.loginPersistent);
    if (emailOrPhone && loginToken) {
      yield put(actions.getToken(emailOrPhone, loginToken));
      const tokenAction = yield take([types.GET_TOKEN_SUCCESS, types.GET_TOKEN_FAILURE]);
      if (tokenAction.type === types.GET_TOKEN_SUCCESS) {
        response = yield call(apiCall, apiFn, apiParams);
      } else if (tokenAction.type === types.GET_TOKEN_FAILURE) {
        yield put(actions.logout());
      }
    } else {
      yield put(actions.logout());
    }
  }
  return response;
}

export function * watchGetToken(api) {
  while (true) {
    const {emailOrPhone, loginToken} = yield take(types.GET_TOKEN);
    yield call(getToken, api, emailOrPhone, loginToken);
  }
}

export function * watchLogout() {
  while (true) {
    yield take(types.LOGOUT);
  }
}
