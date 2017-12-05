import React from 'react';
import PropTypes from 'prop-types';
import {ScrollView, View, Image, Text} from 'react-native';
import RNApptentive from 'react-native-apptentive';
import {images} from '../themes';
import DrawerButton from '../components/DrawerButton';
import styles from './styles/drawerContentStyle';
import i18n from '../i18n/i18n.js';
import {Actions as NavActions, ActionConst as NavActionConst} from 'react-native-router-flux';
import actions from '../actions/creators';
import {get} from 'lodash';
import env from '../core/env';

export default class DrawerContent extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    profile: PropTypes.object
  }

  static contextTypes = {
    drawer: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.handlePress = (scene) => {
      this.context.drawer.toggle();
      NavActions[scene]({type: NavActionConst.REPLACE});

      switch (scene) {
        case 'notifications':
        case 'profile':
          RNApptentive.engage(`${scene}_tapped`);
          break;
        case 'tracker':
          RNApptentive.engage('map_tapped');
          break;
      }
    };
  }

  handlePressLogout = () => {
    const {dispatch} = this.props;
    dispatch(actions.logout());
  };

  render() {
    const {profile} = this.props;
    const {versionNumber, buildNumber} = env;

    const profileName = `${get(profile, 'first_name')} ${get(profile, 'last_name')}`;
    const profileImage = images.profile;

    return (
      <View style={styles.mainContent}>
        <View style={styles.backgroundImageWrapper}>
          <Image source={images.schoolBusBackground} style={styles.backgroundImage} resizeMode='stretch'/>
        </View>
        <ScrollView contentContainerStyle={styles.scrollView}>
          {/*<View style={styles.profileImageContainer}>
            <Image source={profileImage} style={styles.profileImage}/>
            <Text style={styles.profileName}>{profileName}</Text>
          </View>*/}
          <View style={styles.buttonsContainer}>
            <View style={styles.mainButtonsContainer}>
              <DrawerButton icon="user" text={i18n.t('profile')} onPress={this.handlePress.bind(null, 'profile')}/>
              <DrawerButton icon="map-marker" text={i18n.t('tracker')} onPress={this.handlePress.bind(null, 'tracker')}/>
              <DrawerButton icon="bell" text={i18n.t('notifications')} onPress={this.handlePress.bind(null, 'notifications')}/>
              <DrawerButton icon="cog" text={i18n.t('settings')} onPress={this.handlePress.bind(null, 'settings')}/>
              <DrawerButton icon="question-circle" text={i18n.t('help')} onPress={this.handlePress.bind(null, 'help')}/>
            </View>
            <View style={styles.logoutButtonContainer}>
              <DrawerButton icon="power-off" text={i18n.t('logOut')} onPress={this.handlePressLogout}/>
            </View>
          </View>          
          <View style={styles.sidebarLogoContainer}>
            <Text style={styles.sidebarLogoText}>
              {i18n.t('poweredBy')}
            </Text>
            <Text style={styles.sidebarLogoTextBold}>
              {i18n.t('firstStudent')}
            </Text>
          </View>
          <View style={styles.versionNumberContainer}>
            <Text style={styles.versionNumber}>v{versionNumber} ({buildNumber})</Text>
          </View>
        </ScrollView>
      </View>
    )
  }
}
