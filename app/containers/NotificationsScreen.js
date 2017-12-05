import React from 'react';
import PropTypes from 'prop-types';
import {ScrollView, View, Image, Text, ActivityIndicator} from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import {images} from '../themes';
import {connect} from 'react-redux';
import actions from '../actions/creators';
import MainToolbar from '../components/MainToolbar';
import NotificationsList from '../components/NotificationsList';
import {colors} from '../themes';
import i18n from '../i18n/i18n.js';
import {isEmpty} from 'lodash';
import Fabric from 'react-native-fabric';
import {trackScreenView} from '../services/googleAnalytics'
import styles from './styles/notificationsScreenStyle';
const {Answers} = Fabric;

class NotificationsScreen extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    notifications: PropTypes.array,
    notificationsFetching: PropTypes.bool,
    notificationRemoveSubmitting: PropTypes.bool,
    notificationRemoveErrorCode: PropTypes.number,
    notificationRemoveErrorMessage: PropTypes.string
  }

  static contextTypes = {
    drawer: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.title = i18n.t('notifications-title');
  }

  componentWillReceiveProps(newProps) {
    const {dispatch, notificationsFetching, notificationRemoveSubmitting, notificationRemoveErrorCode, notificationRemoveErrorMessage} = newProps;
    const {notificationRemoveSubmitting: oldNotificationRemoveSubmitting} = this.props;

    if (oldNotificationRemoveSubmitting && !notificationRemoveSubmitting) {
      if (notificationRemoveErrorMessage || notificationRemoveErrorCode) {
        this.dropdownAlert.alert('error', i18n.t('error'), notificationRemoveErrorMessage || registrationErrorCode);
      }
      dispatch(actions.getNotifications());
    }
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(actions.getNotifications());
    Answers.logContentView('Notifications view', 'Screen view', 'notifications');
    trackScreenView(this.title);
  }

  handlePressMainToolbarLeft = () => {
    this.context.drawer.toggle();
  }

  handlePressNotificationsListRowRemove = (rowData) => {
    const {dispatch, notificationsFetching, notificationRemoveSubmitting} = this.props;
    dispatch(actions.removeNotification(rowData.id));
  }

  renderNotificationsList = () => {
    const {notifications, notificationsFetching, notificationRemoveSubmitting} = this.props;

    if (isEmpty(notifications) && notificationsFetching) {
      return <ActivityIndicator color={colors.darkBlue} animating={true} size={'large'}/>;
    } else if (isEmpty(notifications)) {
      return <Text style={styles.noNotificationsText}>{i18n.t('notifications-noNotifications')}</Text>
    } else {
      return (
        <NotificationsList
          notifications={notifications}
          notificationsFetching={notificationsFetching}
          notificationRemoveSubmitting={notificationRemoveSubmitting}
          onRowRemovePress={this.handlePressNotificationsListRowRemove}
        />
      );
    }
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <DropdownAlert ref={(c) => this.dropdownAlert = c} />
        <MainToolbar title={this.title} leftButton={{icon: 'bars', onPress: this.handlePressMainToolbarLeft}}/>
        <View style={styles.listContainer}>{this.renderNotificationsList()}</View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    notifications: state.notifications.notificationsData,
    notificationsFetching: state.notifications.notificationsFetching,
    notificationRemoveSubmitting: state.notifications.notificationRemoveSubmitting,
    notificationRemoveErrorCode: state.notifications.notificationRemoveErrorCode,
    notificationRemoveErrorMessage: state.notifications.notificationRemoveErrorMessage
  }
}

export default connect(mapStateToProps)(NotificationsScreen)
