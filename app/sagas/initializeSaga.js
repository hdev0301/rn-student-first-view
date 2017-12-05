import {take, put, select} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import types from '../actions/types';
import actions from '../actions/creators';

export function * watchInitialize() {
  yield take(types.INITIALIZE);
  const {emailOrPhone, loginToken} = yield select(state => state.loginPersistent);
  if (emailOrPhone && loginToken) {
    yield put(actions.getToken(emailOrPhone, loginToken));
    const tokenAction = yield take([types.GET_TOKEN_SUCCESS, types.GET_TOKEN_FAILURE]);
    yield put(actions.initializeSuccess());
  } else {
    yield put(actions.initializeSuccess());
  }
}
