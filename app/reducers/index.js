import {combineReducers} from 'redux';
import initializeReducer from './initializeReducer';
import appStateReducer from './appStateReducer';
import loginReducer from './loginReducer';
import loginPersistentReducer from './loginPersistentReducer';
import trackerReducer from './trackerReducer';
import registerReducer from './registerReducer';
import profileReducer from './profileReducer';
import studentsReducer from './studentsReducer';
import notificationPreferencesReducer from './notificationPreferencesReducer';
import notificationContactsReducer from './notificationContactsReducer';
import etaReducer from './etaReducer';
import feedbackReducer from './feedbackReducer';
import sceneReducer from './sceneReducer';
import confirmationDialogReducer from './confirmationDialogReducer';
import passwordReducer from './passwordReducer';
import walkthroughPersistentReducer from './walkthroughPersistentReducer';
import notificationsReducer from './notificationsReducer';
import oneSignalReducer from './oneSignalReducer';
import pushReducer from './pushReducer';

export default combineReducers({
  initialize: initializeReducer,
  appState: appStateReducer,
  login: loginReducer,
  loginPersistent: loginPersistentReducer,
  tracker: trackerReducer,
  register: registerReducer,
  profile: profileReducer,
  students: studentsReducer,
  notificationPreferences: notificationPreferencesReducer,
  notificationContacts: notificationContactsReducer,
  eta: etaReducer,
  feedback: feedbackReducer,
  scene: sceneReducer,
  confirmationDialog: confirmationDialogReducer,
  password: passwordReducer,
  walkthroughPersistent: walkthroughPersistentReducer,
  notifications: notificationsReducer,
  oneSignal: oneSignalReducer,
  push: pushReducer
});
