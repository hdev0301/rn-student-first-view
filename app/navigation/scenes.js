import React from 'react';
import {Actions as NavActions, Scene} from 'react-native-router-flux';

import StartupScreen from '../components/StartupScreen';
import LoginScreen from '../containers/LoginScreen';
import RegisterScreen from '../containers/RegisterScreen';
import MainScreen from '../containers/MainScreen';
import ProfileScreen from '../containers/ProfileScreen';
import ModifyProfileNameScreen from '../containers/ModifyProfileNameScreen';
import ModifyProfilePhoneScreen from '../containers/ModifyProfilePhoneScreen';
import AddStudentScreen from '../containers/AddStudentScreen';
import StudentSettingsScreen from '../containers/StudentSettingsScreen';
import TrackerScreen from '../containers/TrackerScreen';
import NotificationsScreen from '../containers/NotificationsScreen';
import SettingsScreen from '../containers/SettingsScreen';
import NotificationSettingsScreen from '../containers/NotificationSettingsScreen';
import NotificationRecipientsScreen from '../containers/NotificationRecipientsScreen';
import ModifyRecipientScreen from '../containers/ModifyRecipientScreen';
import HelpScreen from '../containers/HelpScreen';
import FaqScreen from '../components/FaqScreen';
import WalkthroughScreen from '../containers/WalkthroughScreen';
import ContactScreen from '../components/ContactScreen';
import AboutScreen from '../components/AboutScreen';
import PrivacyPolicyScreen from '../components/PrivacyPolicyScreen';
import TermsAndConditionsScreen from '../components/TermsAndConditionsScreen';
import AddFeedbackScreen from '../containers/AddFeedbackScreen';
import ResetPasswordScreen from '../containers/ResetPasswordScreen';

const scenes = NavActions.create(
  <Scene key="root" component={MainScreen} open={false} passProps={true} hideNavBar={true} hideTabBar={true} panHandlers={null}>
    <Scene key="appScenes">
      <Scene key="startup" initial={true} component={StartupScreen}/>

      <Scene key="login" component={LoginScreen}/>
      <Scene key="resetPassword" component={ResetPasswordScreen}/>
      <Scene key="register" component={RegisterScreen}/>

      <Scene key="profile" component={ProfileScreen}/>
      <Scene key="modifyProfileName" component={ModifyProfileNameScreen}/>
      <Scene key="modifyProfilePhone" component={ModifyProfilePhoneScreen}/>
      <Scene key="studentSettings" component={StudentSettingsScreen}/>
      <Scene key="addStudent" component={AddStudentScreen}/>
      <Scene key="tracker" component={TrackerScreen}/>
      <Scene key="addFeedback" component={AddFeedbackScreen}/>

      <Scene key="notifications" component={NotificationsScreen}/>

      <Scene key="settings" component={SettingsScreen}/>
      <Scene key="notificationSettings" component={NotificationSettingsScreen}/>
      <Scene key="notificationRecipients" component={NotificationRecipientsScreen}/>
      <Scene key="modifyRecipient" component={ModifyRecipientScreen}/>

      <Scene key="help" component={HelpScreen}/>
      <Scene key="contact" component={ContactScreen}/>
      <Scene key="faq" component={FaqScreen}/>
      <Scene key="about" component={AboutScreen}/>
      <Scene key="privacyPolicy" component={PrivacyPolicyScreen}/>
      <Scene key="termsAndConditions" component={TermsAndConditionsScreen}/>
      <Scene key="walkthrough" component={WalkthroughScreen}/>
    </Scene>
  </Scene>
);

export default scenes;
