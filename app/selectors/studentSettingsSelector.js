import {createSelector} from 'reselect';
import _ from 'lodash';
import {sortStopVisitTimes} from '../utils/stopUtils';

const selectStudents = () => (state) => state.students.studentsData;
const notificationPreferences = () => (state) => state.notificationPreferences.notificationPreferencesData;
const selectStudentNumber = () => (state, props) => props.studentNumber;

const selectStudent = () => createSelector(
  selectStudents(),
  selectStudentNumber(),
  (students, studentNumber) => {
    const student = _(students).find((s) => _.toString(s.student_number) === _.toString(studentNumber)) || {};
    return _.pick(student, ['student_number', 'first_name', 'last_name']);
  }
);

const selectStudentSchool = () => createSelector(
  selectStudents(),
  selectStudentNumber(),
  (students, studentNumber) => {
    const student = _(students).find((s) => _.toString(s.student_number) === _.toString(studentNumber));
    return _.get(student, 'school', null);
  }
);

const selectStudentStops = () => createSelector(
  selectStudents(),
  selectStudentNumber(),
  notificationPreferences(),
  (students, studentNumber, notificationPreferences) => {
    const student = _(students).find((s) => _.toString(s.student_number) === _.toString(studentNumber));
    const stops = _.get(student, 'stops', null);
    let stopsWithNotificationPreference = _.cloneDeep(stops);
    _.forEach(stopsWithNotificationPreference, stop => {
      const preferences = _.filter(notificationPreferences, np => {
        return _.toString(_.get(np, 'student_stop.student.student_number')) === _.toString(studentNumber) && _.get(np, 'student_stop.id') === stop.id;
      });
      if (!_.isEmpty(preferences)) {
        stop.notificationPreferences = _.map(preferences, preference => _.pick(preference, ['id', 'measure', 'unit', 'threshold']));
      }
    });
    return stopsWithNotificationPreference.sort(sortStopVisitTimes);
  }
);

export {
  selectStudent,
  selectStudentSchool,
  selectStudentStops
};
