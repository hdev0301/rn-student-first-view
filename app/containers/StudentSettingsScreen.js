import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, Image, ScrollView, ListView, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import RNApptentive from 'react-native-apptentive';
import MainToolbar from '../components/MainToolbar';
import NotificationPreferenceModal from './NotificationPreferenceModal';
import i18n from '../i18n/i18n.js';
import {Actions as NavActions, ActionConst as NavActionConst} from 'react-native-router-flux';
import Modal from 'react-native-modalbox';
import actions from '../actions/creators';
import styles from './styles/studentSettingsScreenStyle';
import {get, find, map} from 'lodash';
import CustomButton from '../components/CustomButton';
import {getFormattedTime} from '../utils/dateUtils';
import {colors} from '../themes';
import {formatStopTime} from '../utils/stopUtils';
import {selectStudent, selectStudentSchool, selectStudentStops} from '../selectors/studentSettingsSelector';
import {trackScreenView} from '../services/googleAnalytics';
import Icon from 'react-native-vector-icons/FontAwesome';

import {createIconSetFromIcoMoon} from 'react-native-vector-icons';
import icoMoonConfig from '../themes/fonts/icomoon/selection.json';
const IcoMoon = createIconSetFromIcoMoon(icoMoonConfig);

class StudentSettingsScreen extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    student: PropTypes.object,
    school: PropTypes.object,
    stops: PropTypes.array,
    studentNumber: PropTypes.string.isRequired,
    studentRemoveSubmitting: PropTypes.bool,
    studentRemoveErrorCode: PropTypes.number,
    studentRemoveErrorMessage: PropTypes.string
  }

  static contextTypes = {
    drawer: PropTypes.object,
    dropdownAlert: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.notificationPreferenceModal = null;
    this.title = i18n.t('studentSettings');
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(actions.getStudents());
    dispatch(actions.getNotificationPreferences());
    trackScreenView(this.title);
  }

  componentWillReceiveProps(newProps) {
    const {studentRemoveSubmitting, studentRemoveErrorMessage, studentRemoveErrorCode} = newProps;
    const {studentRemoveSubmitting: oldStudentRemoveSubmitting} = this.props;

    const finishedStudentRemove = oldStudentRemoveSubmitting && !studentRemoveSubmitting;
    if (finishedStudentRemove) {
      const errorMessage = studentRemoveErrorMessage || studentRemoveErrorCode;
      if (errorMessage) {
        this.context.dropdownAlert.alert('error', i18n.t('error'), errorMessage);
      } else {
        NavActions.profile({type: NavActionConst.RESET});
      }
    }
  }

  handlePressRemoveStudent = () => {
    const {dispatch, student, school} = this.props;
    const studentNumber = get(student, 'student_number');
    const districtId = get(school, 'district.id');
    const stateId = get(school, 'district.state.id');
    dispatch(actions.removeStudent({studentNumber, districtId, stateId}));
  }

  handlePressMainToolbarLeft = () => {
    RNApptentive.engage('student_details_back');
    NavActions.profile({type: NavActionConst.BACK});
  }

  handlePressDistanceReminderButton = (stop) => {
    const preference = this.getStopPreference(stop, 'distance', 'mile');
    const stopId = get(stop, 'id', null);
    if (this.notificationPreferenceModal) {
      this.notificationPreferenceModal.getWrappedInstance().open({
        stopId,
        measure: 'distance',
        unit: 'mile',
        preference,
        title: i18n.t('distanceModal-title'),
        infoText: i18n.t('distanceModal-infoText'),
        listSize: 4,
        options: [
          {name: i18n.t('distanceModal-none'), value: null},
          {name: `1 ${i18n.t('distanceModal-mile')}`, value: 1},
          {name: `2 ${i18n.t('distanceModal-miles')}`, value: 2},
          {name: `5 ${i18n.t('distanceModal-miles')}`, value: 5},
        ]
      });
    }
  };

  handlePressTimeNotificationButton = (stop) => {
    const preference = this.getStopPreference(stop, 'time', 'minute');
    const stopId = get(stop, 'id', null);
    this.notificationPreferenceModal && this.notificationPreferenceModal.getWrappedInstance().open({
      stopId,
      measure: 'time',
      unit: 'minute',
      preference,
      title: i18n.t('timeModal-title'),
      infoText: i18n.t('timeModal-infoText'),
      listSize: 3,
      options: [
        {name: i18n.t('timeModal-none'), value: null},
        {name: `5 ${i18n.t('timeModal-mins')}`, value: 5},
        {name: `10 ${i18n.t('timeModal-mins')}`, value: 10}
      ]
    });
  };

  handleOnNotificationPreferenceDone = (measure) => {
    const {dispatch} = this.props;
    dispatch(actions.getNotificationPreferences());

    if (measure === 'time') {
      RNApptentive.engage('time_notification_done');
    } else if (measure === 'distance') {
      RNApptentive.engage('distance_notification_done');
    }
  }

  getStopPreference = (stop, measure, unit) => {
    return find(get(stop, 'notificationPreferences'), p => p.measure === measure && p.unit === unit);
  }

  renderStudentStops = () => {
    const {student, school, stops} = this.props;

    return map(stops, (s) => {
      const id = get(s, 'id');
      const name = get(s, 'stop.name');
      const scheduledTime = get(s, 'scheduled_time');
      const timeZone = get(s, 'time_zone');
      const period = get(s, 'period');
      const formattedScheduledTime = getFormattedTime(scheduledTime, timeZone);
      const schoolAddress = get(school, 'name');
      return (
        <View key={id} style={styles.padded}>
          <View>
            <Text style={styles.listRowDetailsStopInfoAddress}>{schoolAddress}</Text>
          </View>
          <View style={styles.listRowDetailsStopInfoValueContainer}>
            <IcoMoon name={'stop-pin'} size={14} />
            <Text style={styles.listRowDetailsStopInfoValue} numberOfLines={1}>({formatStopTime(formattedScheduledTime)} {period}) {name}</Text>
          </View>
          <View style={styles.actionContainer}>
            <View style={styles.actionIconContainer}>
              <Icon name={'cog'} size={24} color={colors.darkGrey}/>
            </View>
            <View style={styles.actionButtonsContainer}>
              <View style={styles.buttonContainer}><CustomButton onPress={this.handlePressDistanceReminderButton.bind(this, s)} label={i18n.t('studentSettings-distanceReminder')} borderColor={colors.darkGrey} fillColor={colors.white} textColor={colors.darkGrey} size={'small'} showSpinner={false}/></View>
              <View style={styles.buttonContainer}><CustomButton onPress={this.handlePressTimeNotificationButton.bind(this, s)} label={i18n.t('studentSettings-timeNotification')} borderColor={colors.darkGrey} fillColor={colors.white} textColor={colors.darkGrey} size={'small'} showSpinner={false}/></View>
            </View>
          </View>
        </View>
      );
    });
  }

  renderDistrictBranding = () => {
    const {school} = this.props;
    const districtId = get(school, 'district.id');

    let imageUrl = 'https://s3-eu-west-1.amazonaws.com/first-student/districts/firststudent_logo.png';

    switch (districtId) {
      case 'Xenia':
        imageUrl = 'https://s3-eu-west-1.amazonaws.com/first-student/districts/xenia.jpeg';
        break;
      case 'Anoka':
        imageUrl = 'https://s3-eu-west-1.amazonaws.com/first-student/districts/anoka-hennepin.png';
        break;
      case 'Buffalo PSD':
        imageUrl = 'https://s3-eu-west-1.amazonaws.com/first-student/districts/buffalo.jpg';
        break;
      case 'Princeton':
        imageUrl = 'https://s3-eu-west-1.amazonaws.com/first-student/districts/princeton.jpg';
        break;
      case 'Amherst':
        imageUrl = 'https://s3-eu-west-1.amazonaws.com/first-student/districts/firststudent_logo.jpg';
        break;
      case 'Darien':
        imageUrl = 'https://s3-eu-west-1.amazonaws.com/first-student/districts/firststudent_logo.png';
        break;
      default:
    }

    return (
      <View>
        <View style={styles.districtColourOne}></View>
        <View style={styles.districtColourTwo}></View>
        <View style={styles.districtLogoContainer}>
          <Image source={{uri: imageUrl}} style={styles.districtLogoBadge} />
        </View>
      </View>
    );
  }

  render() {
    const {studentRemoveSubmitting} = this.props;

    return (
      <View style={[styles.mainContainer]}>
        <MainToolbar title={this.title} leftButton={{icon: 'chevron-left', onPress: this.handlePressMainToolbarLeft}}/>
        {this.renderDistrictBranding()}
        <ScrollView style={styles.scrollView}>{this.renderStudentStops()}</ScrollView>
        <View style={styles.removeButtonContainer}>
          <CustomButton onPress={this.handlePressRemoveStudent} label={i18n.t('removeStudentButton')} borderColor={colors.red} fillColor={colors.white} textColor={colors.red} showSpinner={studentRemoveSubmitting}/>
        </View>
        <NotificationPreferenceModal onDone={this.handleOnNotificationPreferenceDone} ref={c => this.notificationPreferenceModal = c}/>
      </View>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  student: selectStudent(),
  school: selectStudentSchool(),
  stops: selectStudentStops(),
  studentRemoveSubmitting: (state) => state.students.studentRemoveSubmitting,
  studentRemoveErrorCode: (state) => state.students.studentRemoveErrorCode,
  studentRemoveErrorMessage: (state) => state.students.studentRemoveErrorMessage
});

export default connect(mapStateToProps)(StudentSettingsScreen);
