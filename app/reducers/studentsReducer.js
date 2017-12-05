import types from '../actions/types';
import immutable from 'seamless-immutable';
import {createReducer} from 'reduxsauce';
import {forEach, get, cloneDeep, isEqual, uniqWith, values} from 'lodash';
import {getUniqueCoordinates} from '../utils/stopUtils';

export const INITIAL_STATE = immutable({
  studentsData: [],
  markers: [],
  studentsFetching: false,
  studentsErrorCode: null,
  studentAddSubmitting: false,
  studentAddErrorCode: null,
  studentAddErrorMessage: null,
  studentRemoveSubmitting: false,
  studentRemoveErrorCode: null,
  studentRemoveErrorMessage: null
});

const getStudentsRequest = (state, action) =>
  state.merge({
    studentsFetching: true
  });

const getStudentsSuccess = (state, action) => {
  let markers = [];

  let students = cloneDeep(action.students);

  forEach(students, student => {
    const schoolLat = get(student, 'school.location.lat');
    const schoolLng = get(student, 'school.location.lng');
    if (schoolLat && schoolLng) {
      markers.push({latitude: schoolLat, longitude: schoolLng});
    }    
  });

  markers = uniqWith(markers, isEqual);

  forEach(students, student => {
    let studentMarkers = [];
    forEach(student.stops, stopData => {
      const stopLat = get(stopData, 'stop.lat');
      const stopLng = get(stopData, 'stop.lng');
      if (stopLat && stopLng) {
        const {latitude, longitude} = getUniqueCoordinates(markers, {latitude: stopLat, longitude: stopLng});
        stopData.stop.lat = latitude;
        stopData.stop.lng = longitude;
        studentMarkers.push({latitude, longitude});
      }
    });
      
    markers = markers.concat(studentMarkers);
  });
  
  return state.merge({
    studentsFetching: false,
    studentsErrorCode: null,
    studentsData: students,
    markers
  });
}

const getStudentsFailure = (state, action) =>
  state.merge({
    studentsFetching: false,
    studentsErrorCode: action.errorCode,
    studentsData: [],
    markers: []
  });

const addStudentRequest = (state, action) =>
  state.merge({
    studentAddSubmitting: true,
    studentAddErrorCode: null,
    studentAddErrorMessage: null
  });

const addStudentSuccess = (state, action) =>
  state.merge({
    studentAddSubmitting: false,
    studentAddErrorCode: null,
    studentAddErrorMessage: null
  });

const addStudentFailure = (state, action) =>
  state.merge({
    studentAddSubmitting: false,
    studentAddErrorCode: action.errorCode,
    studentAddErrorMessage: action.errors ? values(action.errors).join('. ') : action.message
  });

const removeStudentRequest = (state, action) =>
  state.merge({
    studentRemoveSubmitting: true,
    studentRemoveErrorCode: null,
    studentRemoveErrorMessage: null
  });

const removeStudentSuccess = (state, action) =>
  state.merge({
    studentRemoveSubmitting: false,
    studentRemoveErrorCode: null,
    studentRemoveErrorMessage: null
  });

const removeStudentFailure = (state, action) =>
  state.merge({
    studentRemoveSubmitting: false,
    studentRemoveErrorCode: action.errorCode,
    studentRemoveErrorMessage: action.errors ? values(action.errors).join('. ') : action.message
  });

const logout = (state, action) => INITIAL_STATE;

const ACTION_HANDLERS = {
  [types.GET_STUDENTS]: getStudentsRequest,
  [types.GET_STUDENTS_SUCCESS]: getStudentsSuccess,
  [types.GET_STUDENTS_FAILURE]: getStudentsFailure,
  [types.ADD_STUDENT]: addStudentRequest,
  [types.ADD_STUDENT_SUCCESS]: addStudentSuccess,
  [types.ADD_STUDENT_FAILURE]: addStudentFailure,
  [types.REMOVE_STUDENT]: removeStudentRequest,
  [types.REMOVE_STUDENT_SUCCESS]: removeStudentSuccess,
  [types.REMOVE_STUDENT_FAILURE]: removeStudentFailure,
  [types.LOGOUT]: logout
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
