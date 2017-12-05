import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, StatusBar, Navigator, Text} from 'react-native';
import {connect} from 'react-redux';
import RNApptentive from 'react-native-apptentive';
import actions from '../actions/creators';
import {colors} from '../themes';
import Drawer from 'react-native-drawer';
import DrawerContent from '../components/DrawerContent';
import FeedbackButton from '../components/FeedbackButton';
import ConfirmationDialog from '../containers/ConfirmationDialog';
import {DefaultRenderer} from 'react-native-router-flux';
import {Actions as NavActions} from 'react-native-router-flux';
import DropdownAlert from 'react-native-dropdownalert';
import {Crashlytics} from 'react-native-fabric';
import {get, isEqual, isEmpty, includes} from 'lodash';
import styles, {drawerStyles} from './styles/mainScreenStyle';

class MainScreen extends Component {
  static propTypes = {
    navigationState: PropTypes.object,
    onNavigate: PropTypes.func,
    dispatch: PropTypes.func.isRequired,
    scene: PropTypes.object.isRequired
  };

  static childContextTypes = {
    dropdownAlert: PropTypes.object
  };

  getChildContext = () => ({
    dropdownAlert: this.dropdownAlert
  });

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(actions.getProfile());
  }

  componentWillReceiveProps(newProps) {
    const {profile} = newProps;
    const {profile: oldProfile} = this.props;

    if (!isEmpty(profile) && !isEqual(profile, oldProfile)) {
      this.setCrashlyticsProfile(profile);
    }
  }

  setCrashlyticsProfile = (profile) => {
    const profileFullName = `${get(profile, 'first_name')} ${get(profile, 'last_name')}`;
    const profileEmail = get(profile, 'email', '');
    const profilePhone = get(profile, 'phone', '');
    const profileId = get(profile, 'id', '');

    Crashlytics.setUserIdentifier(profileEmail);
    Crashlytics.setUserName(profileFullName);
    Crashlytics.setString('fullName', profileFullName);
    Crashlytics.setUserEmail(profileEmail);
    Crashlytics.setString('phone', profilePhone);
  }

  handleDrawerOpen = () => {
    RNApptentive.engage('hamburger_menu_tapped');
  }

  render() {
    const {navigationState, onNavigate, profile, dispatch, scene} = this.props;
    const sceneKey = get(scene, 'sceneKey');
    const showFeedbackButton = !includes(['startup', 'login', 'resetPassword', 'register', 'addFeedback', 'walkthrough'], sceneKey);

    return (
      <View style={styles.applicationView}>
        <DropdownAlert ref={(c) => this.dropdownAlert = c}/>
        <StatusBar barStyle='default' backgroundColor={colors.darkGrey}/>
        <Drawer
          ref='drawer'
          open={navigationState.open}
          content={<DrawerContent dispatch={dispatch} profile={profile}/>}
          styles={drawerStyles}
          openDrawerOffset={80}
          type='overlay'
          tapToClose={true}
          panOpenMask={0.05}
          panCloseMask={0.3}
          acceptPan={false}
          side={'left'}
          onOpen={this.handleDrawerOpen}
        >
          <DefaultRenderer navigationState={navigationState.children[0]} onNavigate={onNavigate}/>
        </Drawer>
        {showFeedbackButton && <FeedbackButton onPress={NavActions.addFeedback}/>}
        <ConfirmationDialog/>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    profile: state.profile.profileData,
    scene: state.scene.sceneData
  }
};

export default connect(mapStateToProps)(MainScreen);
