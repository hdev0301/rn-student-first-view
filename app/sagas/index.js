import {fork} from 'redux-saga/effects';
import apiService from '../services/api';
import oneSignalApiService from '../services/oneSignalApi';
import {watchInitialize} from './initializeSaga';
import {watchOneSignalEvents, watchSubscribeToOneSignal, watchUnsubscribeFromOneSignal, watchViewOneSignalDevice} from './oneSignalSaga';
import {watchRegisterPush} from './pushSaga';
import {watchGetToken, watchLogout} from './authSaga';
import {watchLogin} from './loginSaga';
import {watchGetStops, watchStartEtaRefreshLoop} from './trackerSaga';
import {watchGetEta} from './etaSaga';
import {watchRegister, watchGetStatesAndDistricts} from './registerSaga';
import {watchGetProfile, watchUpdateProfile} from './profileSaga';
import {watchGetStudents, watchAddStudent, watchRemoveStudent} from './studentsSaga';
import {watchGetNotificationPreferences, watchAddNotificationPreference, watchUpdateNotificationPreference, watchRemoveNotificationPreference} from './notificationPreferencesSaga';
import {watchGetNotificationContacts, watchAddNotificationContact, watchUpdateNotificationContact, watchRemoveNotificationContact} from './notificationContactsSaga';
import {watchAddFeedback} from './feedbackSaga';
import {watchResetPassword} from './passwordSaga';
import {watchGetNotifications, watchRemoveNotification} from './notificationsSaga';

const api = apiService.create();
const oneSignalApi = oneSignalApiService.create();

export default function * root() {
  yield fork(watchInitialize)
  yield fork(watchOneSignalEvents)
  yield fork(watchSubscribeToOneSignal)
  yield fork(watchUnsubscribeFromOneSignal)
  yield fork(watchViewOneSignalDevice.bind(null, oneSignalApi))
  yield fork(watchRegister.bind(null, api))
  yield fork(watchRegisterPush.bind(null, api))
  yield fork(watchLogin.bind(null, api))
  yield fork(watchLogout)
  yield fork(watchGetStops)
  yield fork(watchStartEtaRefreshLoop)
  yield fork(watchGetEta.bind(null, api))
  yield fork(watchGetToken.bind(null, api))
  yield fork(watchGetStatesAndDistricts.bind(null, api))
  yield fork(watchGetProfile.bind(null, api))
  yield fork(watchUpdateProfile.bind(null, api))
  yield fork(watchGetStudents.bind(null, api))
  yield fork(watchAddStudent.bind(null, api))
  yield fork(watchRemoveStudent.bind(null, api))
  yield fork(watchGetNotificationPreferences.bind(null, api))
  yield fork(watchAddNotificationPreference.bind(null, api))
  yield fork(watchUpdateNotificationPreference.bind(null, api))
  yield fork(watchRemoveNotificationPreference.bind(null, api))
  yield fork(watchGetNotificationContacts.bind(null, api))
  yield fork(watchAddNotificationContact.bind(null, api))
  yield fork(watchUpdateNotificationContact.bind(null, api))
  yield fork(watchRemoveNotificationContact.bind(null, api))
  yield fork(watchAddFeedback.bind(null, api))
  yield fork(watchResetPassword.bind(null, api))
  yield fork(watchGetNotifications.bind(null, api))
  yield fork(watchRemoveNotification.bind(null, api))
}
