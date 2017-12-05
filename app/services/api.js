import apisauce from 'apisauce';
import DeviceInfo from 'react-native-device-info';
import {isEmpty}from 'lodash';
import env from '../core/env';
import {Platform} from 'react-native';

const encodeRFC5987ValueChars = (str) => {
  return encodeURIComponent(str).
    // Note that although RFC3986 reserves "!", RFC5987 does not,
    // so we do not need to escape it
    replace(/['()]/g, escape). // i.e., %27 %28 %29
    replace(/\*/g, '%2A').
    // The following are not required for percent-encoding per RFC5987,
    // so we can allow for a little better readability over the wire: |`^
    replace(/%(?:7C|60|5E)/g, unescape);
};

const create = (baseURL = env.baseApiUrl) => {
  const defaultConfig = {
    headers: {
      'FS-Client-Platform': Platform.OS,
      'FS-Client-Version': encodeRFC5987ValueChars(env.versionNumber),
      'FS-Client-Build': env.buildNumber
    }
  };

  const api = apisauce.create({
    baseURL,
    timeout: 10000
  });

  const authHeaders = (authToken) => {
    return {
      headers: {
        ...defaultConfig.headers,
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${authToken}`
      }
    };
  };

  const signIn = (emailOrPhone, password) => api.post('/sign-in', {
    email_or_phone: emailOrPhone,
    password,
    device_name: DeviceInfo.getSystemName(),
    device_uid: DeviceInfo.getUniqueID()
  }, defaultConfig);

  const getToken = (emailOrPhone, loginToken) => api.post('/get-token', {
    email_or_phone: emailOrPhone,
    login_token: loginToken
  }, defaultConfig);

  const register = (registrationData) => {
    const data = {
      first_name: registrationData.firstName,
      last_name: registrationData.lastName,
      phone: registrationData.phone,
      email: registrationData.email,
      password: registrationData.password,
      password_confirmation: registrationData.passwordConfirmation
    };
    return api.post('/register', data, defaultConfig);
  };

  const getStatesAndDistricts = () => api.post('/states?districts=true', null, defaultConfig);

  const addStudent = (authToken, studentData) => {
    const data = {
      student_number: studentData.studentNumber,
      state_id: studentData.stateId,
      district_id: studentData.districtId
    }
    if (!isEmpty(studentData.securityCode)) {
      data.security_code = studentData.securityCode;
    }
    return api.post('/add-student', data, authHeaders(authToken));
  }

  const removeStudent = (authToken, studentData) => api.post('/remove-student', {
    student_number: studentData.studentNumber,
    state_id: studentData.stateId,
    district_id: studentData.districtId
  }, authHeaders(authToken));

  const getProfile = (authToken) => api.get('/profile', null, authHeaders(authToken));

  const getStudents = (authToken) => api.get('/students', null, authHeaders(authToken));

  const getEta = (authToken) => api.get('/eta', null, authHeaders(authToken));

  const addFeedback = (authToken, feedbackData) => api.post('/feedback', {
    message: feedbackData.message
  }, authHeaders(authToken));

  const resetPassword = (emailOrPhone) => api.post('/password-reset', {
    email_or_phone: emailOrPhone
  }, defaultConfig);

  const getNotifications = (authToken) => api.get('/notifications', null, authHeaders(authToken));

  const removeNotification = (authToken, notificationId) => api.delete(`/notifications/${notificationId}`, null, authHeaders(authToken));

  const registerPush = (authToken, pushId) => api.post('/register-push', {
    push_id: pushId,
    platform: Platform.OS
  }, authHeaders(authToken));

  const getNotificationPreferences = (authToken) => api.get('notification-preferences', null, authHeaders(authToken));

  const addNotificationPreference = (authToken, preferenceData) => api.post('notification-preferences', {
    stop_id: preferenceData.stopId,
    measure: preferenceData.measure,
    unit: preferenceData.unit,
    threshold: preferenceData.threshold
  }, authHeaders(authToken));

  const updateNotificationPreference = (authToken, preferenceData) => api.patch(`notification-preferences/${preferenceData.id}`, {
    measure: preferenceData.measure,
    unit: preferenceData.unit,
    threshold: preferenceData.threshold
  }, authHeaders(authToken));

  const removeNotificationPreference = (authToken, preferenceId) => api.delete(`notification-preferences/${preferenceId}`, null, authHeaders(authToken));

  const getNotificationContacts = (authToken) => api.get('notification-contacts', null, authHeaders(authToken));

  const addNotificationContact = (authToken, contactData) => api.post('notification-contacts', {
    name: contactData.name,
    email: contactData.email
  }, authHeaders(authToken));

  const updateNotificationContact = (authToken, contactData) => api.patch(`notification-contacts/${contactData.id}`, {
    name: contactData.name,
    email: contactData.email
  }, authHeaders(authToken));

  const removeNotificationContact = (authToken, contactId) => api.delete(`notification-contacts/${contactId}`, null, authHeaders(authToken));

  const updateProfile = (authToken, profileData) => api.patch('profile', {
    first_name: profileData.firstName,
    last_name: profileData.lastName,
    phone: profileData.phone
  }, authHeaders(authToken));

  return {
    signIn,
    getToken,
    register,
    getStatesAndDistricts,
    addStudent,
    removeStudent,
    getProfile,
    getStudents,
    getEta,
    addFeedback,
    resetPassword,
    getNotifications,
    removeNotification,
    registerPush,
    getNotificationPreferences,
    addNotificationPreference,
    updateNotificationPreference,
    removeNotificationPreference,
    getNotificationContacts,
    addNotificationContact,
    updateNotificationContact,
    removeNotificationContact,
    updateProfile
  }
};

export default {
  create
}
