import types from './types';

const initialize = () => ({type: types.INITIALIZE});
const initializeSuccess = () => ({type: types.INITIALIZE_SUCCESS});

const setHasSeenWalkthrough = () => ({type: types.SET_HAS_SEEN_WALKTHROUGH});

const register = (registrationData) => ({type: types.REGISTER, registrationData});
const registerSuccess = (message) => ({type: types.REGISTER_SUCCESS, message});
const registerFailure = (errorCode, errors, message) => ({type: types.REGISTER_FAILURE, errorCode, errors, message});
const clearRegistrationSuccessMessage = () => ({type: types.CLEAR_REGISTRATION_SUCCESS_MESSAGE});

const login = (emailOrPhone, password) => ({type: types.LOGIN, emailOrPhone, password});
const loginSuccess = (emailOrPhone, loginToken) => ({type: types.LOGIN_SUCCESS, emailOrPhone, loginToken});
const loginFailure = (errorCode, errors, message, problem) => ({type: types.LOGIN_FAILURE, errorCode, errors, message, problem});

const getToken = (emailOrPhone, loginToken) => ({type: types.GET_TOKEN, emailOrPhone, loginToken});
const getTokenSuccess = (emailOrPhone, authToken) => ({type: types.GET_TOKEN_SUCCESS, emailOrPhone, authToken});
const getTokenFailure = (errorCode, problem) => ({type: types.GET_TOKEN_FAILURE, errorCode, problem});

const logout = () => ({type: types.LOGOUT});

const getStops = () => ({type: types.GET_STOPS});
const getStopsSuccess = () => ({type: types.GET_STOPS_SUCCESS});
const getStopsFailure = () => ({type: types.GET_STOPS_FAILURE});

const getEta = () => ({type: types.GET_ETA});
const getEtaSuccess = (eta, markers) => ({type: types.GET_ETA_SUCCESS, eta, markers});
const getEtaFailure = () => ({type: types.GET_ETA_FAILURE});

const startEtaRefreshLoop = (delayed) => ({type: types.START_ETA_REFRESH_LOOP, delayed});
const stopEtaRefreshLoop = () => ({type: types.STOP_ETA_REFRESH_LOOP});
const etaUpdateCounter = (counter) => ({type: types.ETA_UPDATE_COUNTER, counter});
const etaRefreshLoopSuccess = () => ({type: types.ETA_REFRESH_LOOP_SUCCESS});
const etaRefreshLoopFailure = () => ({type: types.ETA_REFRESH_LOOP_FAILURE});

const getStatesAndDistricts = () => ({type: types.GET_STATES_AND_DISTRICTS});
const getStatesAndDistrictsSuccess = (statesAndDistricts) => ({type: types.GET_STATES_AND_DISTRICTS_SUCCESS, statesAndDistricts});
const getStatesAndDistrictsFailure = (errorCode) => ({type: types.GET_STATES_AND_DISTRICTS_FAILURE, errorCode});

const getProfile = () => ({type: types.GET_PROFILE});
const getProfileSuccess = (profile) => ({type: types.GET_PROFILE_SUCCESS, profile});
const getProfileFailure = (errorCode) => ({type: types.GET_PROFILE_FAILURE, errorCode});

const getStudents = () => ({type: types.GET_STUDENTS});
const getStudentsSuccess = (students) => ({type: types.GET_STUDENTS_SUCCESS, students});
const getStudentsFailure = (errorCode) => ({type: types.GET_STUDENTS_FAILURE, errorCode});

const addStudent = (studentData) => ({type: types.ADD_STUDENT, studentData});
const addStudentSuccess = (studentData) => ({type: types.ADD_STUDENT_SUCCESS, studentData});
const addStudentFailure = (errorCode, errors, message) => ({type: types.ADD_STUDENT_FAILURE, errorCode, errors, message});

const removeStudent = (studentData) => ({type: types.REMOVE_STUDENT, studentData});
const removeStudentSuccess = (studentData) => ({type: types.REMOVE_STUDENT_SUCCESS, studentData});
const removeStudentFailure = (errorCode, errors, message) => ({type: types.REMOVE_STUDENT_FAILURE, errorCode, errors, message});

const addFeedback = (feedbackData) => ({type: types.ADD_FEEDBACK, feedbackData});
const addFeedbackSuccess = (feedbackData) => ({type: types.ADD_FEEDBACK_SUCCESS, feedbackData});
const addFeedbackFailure = (errorCode, errors, message) => ({type: types.ADD_FEEDBACK_FAILURE, errorCode, errors, message});

const setConfirmationDialogMessage = (message) => ({type: types.SET_CONFIRMATION_DIALOG_MESSAGE, message});
const clearConfirmationDialogMessage = () => ({type: types.CLEAR_CONFIRMATION_DIALOG_MESSAGE});

const resetPassword = (emailOrPhone) => ({type: types.RESET_PASSWORD, emailOrPhone});
const resetPasswordSuccess = () => ({type: types.RESET_PASSWORD_SUCCESS});
const resetPasswordFailure = (errorCode, errors, message) => ({type: types.RESET_PASSWORD_FAILURE, errorCode, errors, message});

const getNotifications = () => ({type: types.GET_NOTIFICATIONS});
const getNotificationsSuccess = (notificationsData) => ({type: types.GET_NOTIFICATIONS_SUCCESS, notificationsData});
const getNotificationsFailure = (errorCode) => ({type: types.GET_NOTIFICATIONS_FAILURE, errorCode});

const removeNotification = (notificationId) => ({type: types.REMOVE_NOTIFICATION, notificationId});
const removeNotificationSuccess = (notificationId) => ({type: types.REMOVE_NOTIFICATION_SUCCESS, notificationId});
const removeNotificationFailure = (errorCode, message) => ({type: types.REMOVE_NOTIFICATION_FAILURE, errorCode, message});

const registerPush = (pushId) => ({type: types.REGISTER_PUSH, pushId});
const registerPushSuccess = () => ({type: types.REGISTER_PUSH_SUCCESS});
const registerPushFailure = (errorCode, message) => ({type: types.REGISTER_PUSH_FAILURE, errorCode, message});

const oneSignalIdsAvailable = (ids) => ({type: types.ONE_SIGNAL_IDS_AVAILABLE, ids});
const subscribeToOneSignal = () => ({type: types.SUBSCRIBE_TO_ONE_SIGNAL});
const unsubscribeFromOneSignal = () => ({type: types.UNSUBSCRIBE_FROM_ONE_SIGNAL});

const viewOneSignalDevice = (pushId) => ({type: types.VIEW_ONE_SIGNAL_DEVICE, pushId});
const viewOneSignalDeviceSuccess = (device) => ({type: types.VIEW_ONE_SIGNAL_DEVICE_SUCCESS, device});
const viewOneSignalDeviceFailure = (errorCode, errors) => ({type: types.VIEW_ONE_SIGNAL_DEVICE_FAILURE, errorCode, errors});

const getNotificationPreferences = () => ({type: types.GET_NOTIFICATION_PREFERENCES});
const getNotificationPreferencesSuccess = (notificationPreferences) => ({type: types.GET_NOTIFICATION_PREFERENCES_SUCCESS, notificationPreferences});
const getNotificationPreferencesFailure = (errorCode) => ({type: types.GET_NOTIFICATION_PREFERENCES_FAILURE, errorCode});

const addNotificationPreference = (preferenceData) => ({type: types.ADD_NOTIFICATION_PREFERENCE, preferenceData});
const addNotificationPreferenceSuccess = (preferenceData) => ({type: types.ADD_NOTIFICATION_PREFERENCE_SUCCESS, preferenceData});
const addNotificationPreferenceFailure = (errorCode, errors, message) => ({type: types.ADD_NOTIFICATION_PREFERENCE_FAILURE, errorCode, errors, message});

const updateNotificationPreference = (preferenceData) => ({type: types.UPDATE_NOTIFICATION_PREFERENCE, preferenceData});
const updateNotificationPreferenceSuccess = (preferenceData) => ({type: types.UPDATE_NOTIFICATION_PREFERENCE_SUCCESS, preferenceData});
const updateNotificationPreferenceFailure = (errorCode, errors, message) => ({type: types.UPDATE_NOTIFICATION_PREFERENCE_FAILURE, errorCode, errors, message});

const removeNotificationPreference = (preferenceId) => ({type: types.REMOVE_NOTIFICATION_PREFERENCE, preferenceId});
const removeNotificationPreferenceSuccess = (preferenceId) => ({type: types.REMOVE_NOTIFICATION_PREFERENCE_SUCCESS, preferenceId});
const removeNotificationPreferenceFailure = (errorCode, message) => ({type: types.REMOVE_NOTIFICATION_PREFERENCE_FAILURE, errorCode, message});

const getNotificationContacts = () => ({type: types.GET_NOTIFICATION_CONTACTS});
const getNotificationContactsSuccess = (notificationContacts) => ({type: types.GET_NOTIFICATION_CONTACTS_SUCCESS, notificationContacts});
const getNotificationContactsFailure = (errorCode) => ({type: types.GET_NOTIFICATION_CONTACTS_FAILURE, errorCode});

const addNotificationContact = (contactData) => ({type: types.ADD_NOTIFICATION_CONTACT, contactData});
const addNotificationContactSuccess = (contactData) => ({type: types.ADD_NOTIFICATION_CONTACT_SUCCESS, contactData});
const addNotificationContactFailure = (errorCode, errors, message) => ({type: types.ADD_NOTIFICATION_CONTACT_FAILURE, errorCode, errors, message});

const updateNotificationContact = (contactData) => ({type: types.UPDATE_NOTIFICATION_CONTACT, contactData});
const updateNotificationContactSuccess = (contactData) => ({type: types.UPDATE_NOTIFICATION_CONTACT_SUCCESS, contactData});
const updateNotificationContactFailure = (errorCode, errors, message) => ({type: types.UPDATE_NOTIFICATION_CONTACT_FAILURE, errorCode, errors, message});

const removeNotificationContact = (contactId) => ({type: types.REMOVE_NOTIFICATION_CONTACT, contactId});
const removeNotificationContactSuccess = (contactId) => ({type: types.REMOVE_NOTIFICATION_CONTACT_SUCCESS, contactId});
const removeNotificationContactFailure = (errorCode, message) => ({type: types.REMOVE_NOTIFICATION_CONTACT_FAILURE, errorCode, message});

const updateProfile = (profileData) => ({type: types.UPDATE_PROFILE, profileData});
const updateProfileSuccess = (profileData) => ({type: types.UPDATE_PROFILE_SUCCESS, profileData});
const updateProfileFailure = (errorCode, errors, message) => ({type: types.UPDATE_PROFILE_FAILURE, errorCode, errors, message});

export default {
  initialize,
  initializeSuccess,
  setHasSeenWalkthrough,
  register,
  registerSuccess,
  registerFailure,
  clearRegistrationSuccessMessage,
  login,
  loginSuccess,
  loginFailure,
  getToken,
  getTokenSuccess,
  getTokenFailure,
  logout,
  getStops,
  getStopsSuccess,
  getStopsFailure,
  getEta,
  getEtaSuccess,
  getEtaFailure,
  startEtaRefreshLoop,
  stopEtaRefreshLoop,
  etaUpdateCounter,
  etaRefreshLoopSuccess,
  etaRefreshLoopFailure,
  getStatesAndDistricts,
  getStatesAndDistrictsSuccess,
  getStatesAndDistrictsFailure,
  getProfile,
  getProfileSuccess,
  getProfileFailure,
  updateProfile,
  updateProfileSuccess,
  updateProfileFailure,
  getStudents,
  getStudentsSuccess,
  getStudentsFailure,
  addStudent,
  addStudentSuccess,
  addStudentFailure,
  removeStudent,
  removeStudentSuccess,
  removeStudentFailure,
  addFeedback,
  addFeedbackSuccess,
  addFeedbackFailure,
  setConfirmationDialogMessage,
  clearConfirmationDialogMessage,
  resetPassword,
  resetPasswordSuccess,
  resetPasswordFailure,
  getNotifications,
  getNotificationsSuccess,
  getNotificationsFailure,
  removeNotification,
  removeNotificationSuccess,
  removeNotificationFailure,
  registerPush,
  registerPushSuccess,
  registerPushFailure,
  oneSignalIdsAvailable,
  subscribeToOneSignal,
  unsubscribeFromOneSignal,
  viewOneSignalDevice,
  viewOneSignalDeviceSuccess,
  viewOneSignalDeviceFailure,
  getNotificationPreferences,
  getNotificationPreferencesSuccess,
  getNotificationPreferencesFailure,
  addNotificationPreference,
  addNotificationPreferenceSuccess,
  addNotificationPreferenceFailure,
  updateNotificationPreference,
  updateNotificationPreferenceSuccess,
  updateNotificationPreferenceFailure,
  removeNotificationPreference,
  removeNotificationPreferenceSuccess,
  removeNotificationPreferenceFailure,
  getNotificationContacts,
  getNotificationContactsSuccess,
  getNotificationContactsFailure,
  addNotificationContact,
  addNotificationContactSuccess,
  addNotificationContactFailure,
  updateNotificationContact,
  updateNotificationContactSuccess,
  updateNotificationContactFailure,
  removeNotificationContact,
  removeNotificationContactSuccess,
  removeNotificationContactFailure
}
