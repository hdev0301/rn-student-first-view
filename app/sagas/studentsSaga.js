import {take, put, call} from 'redux-saga/effects';
import types from '../actions/types';
import actions from '../actions/creators';
import {authSaga} from './authSaga';
import {get} from 'lodash';

function * getStudents(api) {
  const response = yield call(authSaga, api.getStudents);
  const data = get(response, 'data');
  const statusCode = get(data, 'response.code');
  if (statusCode === 200) {
    const students = get(data, 'result');
    yield put(actions.getStudentsSuccess(students));
  } else {
    yield put(actions.getStudentsFailure(statusCode));
  }
}

function * addStudent(api, studentData) {
  const response = yield call(authSaga, api.addStudent, studentData);
  const data = get(response, 'data');
  const statusCode = get(data, 'response.code');
  if (statusCode === 200) {
    yield put(actions.addStudentSuccess(studentData));
  } else {
    const message = get(data, 'message');
    const errors = get(data, 'errors');
    yield put(actions.addStudentFailure(statusCode, errors, message));
  }
}

function * removeStudent(api, studentData) {
  const response = yield call(authSaga, api.removeStudent, studentData);
  const data = get(response, 'data');
  const statusCode = get(data, 'response.code');
  if (statusCode === 200) {
    yield put(actions.removeStudentSuccess(studentData));
  } else {
    const message = get(data, 'message');
    const errors = get(data, 'errors');
    yield put(actions.removeStudentFailure(statusCode, errors, message));
  }
}

export function * watchGetStudents(api) {
  while (true) {
    yield take(types.GET_STUDENTS);
    yield call(getStudents, api);
  }
}

export function * watchAddStudent(api) {
  while (true) {
    const {studentData} = yield take(types.ADD_STUDENT);
    yield call(addStudent, api, studentData);
  }
}

export function * watchRemoveStudent(api) {
  while (true) {
    const {studentData} = yield take(types.REMOVE_STUDENT);
    yield call(removeStudent, api, studentData);
  }
}
