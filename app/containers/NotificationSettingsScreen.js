import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, Switch, ActivityIndicator} from 'react-native';
import {connect} from 'react-redux';
import MainToolbar from '../components/MainToolbar';
import i18n from '../i18n/i18n.js';
import {Actions as NavActions, ActionConst as NavActionConst} from 'react-native-router-flux';
import actions from '../actions/creators';
import {colors} from '../themes';
import {trackScreenView} from '../services/googleAnalytics';
import styles from './styles/notificationSettingsScreenStyle';

class NotificationSettingsScreen extends Component {
  static propTypes = {
    pushId: PropTypes.string,
    pushIdInvalid: PropTypes.bool,
    viewOneSignalDeviceFetching: PropTypes.bool
  }

  constructor(props) {
    super(props);

    this.viewOneSignalDeviceTimeout = null;

    this.state = {
      pushNotificationSwitchIsOn: false,
      pushNotificationSwitchSynchronizing: false
    };

    this.title = i18n.t('notificationSettings');
  }

  componentDidMount() {
    const {dispatch, pushId} = this.props;
    if (!!pushId) {
      dispatch(actions.viewOneSignalDevice(pushId));
    }
    trackScreenView(this.title);
  }

  componentWillReceiveProps(newProps) {
    const {viewOneSignalDeviceFetching, pushIdInvalid, pushId} = newProps;
    const {viewOneSignalDeviceFetching: oldViewOneSignalDeviceFetching, pushId: oldPushId} = this.props;

    if (!!pushId && pushId !== oldPushId) {
      dispatch(actions.viewOneSignalDevice(pushId));
    }

    if (oldViewOneSignalDeviceFetching && !viewOneSignalDeviceFetching) {
      this.setState({pushNotificationSwitchIsOn: !pushIdInvalid, pushNotificationSwitchSynchronizing: false});
    }
  }

  componentWillUnmount() {
    clearTimeout(this.viewOneSignalDeviceTimeout);
    this.viewOneSignalDeviceTimeout = null;
  }

  handlePressMainToolbarLeft = () => {
    NavActions.settings({type: NavActionConst.BACK});
  }

  handleNotificationSwitch = (value) => {
    const {dispatch, pushId} = this.props;
    const {pushNotificationSwitchSynchronizing} = this.state;
    if (!!pushId && !pushNotificationSwitchSynchronizing) {
      this.setState({pushNotificationSwitchIsOn: value, pushNotificationSwitchSynchronizing: true});
      if (value) {
        dispatch(actions.subscribeToOneSignal());
      } else {
        dispatch(actions.unsubscribeFromOneSignal());
      }
      clearTimeout(this.viewOneSignalDeviceTimeout);
      this.viewOneSignalDeviceTimeout = setTimeout(() => dispatch(actions.viewOneSignalDevice(pushId)), 6000);
    }
  }

  render() {
    const {pushId} = this.props;
    const {pushNotificationSwitchIsOn, pushNotificationSwitchSynchronizing} = this.state;
    return (
      <View style={[styles.mainContainer]}>
        <MainToolbar title={this.title} leftButton={{icon: 'chevron-left', onPress: this.handlePressMainToolbarLeft}}/>
        <View style={styles.introTextContainer}>
          <Text style={styles.introText}>{i18n.t('notificationSettings-intro')}</Text>
        </View>
        <View style={styles.listRow}>
          <View style={styles.listRowTextContainer}>
            <Text style={styles.listRowText}>{i18n.t('notificationSettings-pushNotifications')}</Text>
          </View>
          {pushNotificationSwitchSynchronizing && <ActivityIndicator style={styles.pushSwitchProcessingIndicator} color={colors.darkBlue} animating={true} size={'small'}/>}
          <View style={styles.listRowArrowContainer}>
            <Switch
              disabled={!pushId || pushNotificationSwitchSynchronizing}
              onValueChange={this.handleNotificationSwitch}
              value={pushNotificationSwitchIsOn} />
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    pushId: state.oneSignal.pushId,
    pushIdInvalid: state.oneSignal.pushIdInvalid,
    viewOneSignalDeviceFetching: state.oneSignal.viewOneSignalDeviceFetching
  }
};

export default connect(mapStateToProps)(NotificationSettingsScreen);
