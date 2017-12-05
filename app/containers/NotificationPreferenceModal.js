import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, ListView, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import i18n from '../i18n/i18n.js';
import Modal from 'react-native-modalbox';
import actions from '../actions/creators';
import {selectStudent, selectStudentSchool, selectStudentStops} from '../selectors/studentSettingsSelector';
import Icon from 'react-native-vector-icons/FontAwesome';
import {get} from 'lodash';
import immutable from 'seamless-immutable';
import {colors} from '../themes';
import {trackScreenView} from '../services/googleAnalytics';
import styles from './styles/notificationPreferenceModalStyle';

class NotificationPreferenceModal extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    onDone: PropTypes.func,
    notificationPreferenceAddSubmitting: PropTypes.bool,
    notificationPreferenceAddErrorCode: PropTypes.number,
    notificationPreferenceAddErrorMessage: PropTypes.string,
    notificationPreferenceUpdateSubmitting: PropTypes.bool,
    notificationPreferenceUpdateErrorCode: PropTypes.number,
    notificationPreferenceUpdateErrorMessage: PropTypes.string,
    notificationPreferenceRemoveSubmitting: PropTypes.bool,
    notificationPreferenceRemoveErrorCode: PropTypes.number,
    notificationPreferenceRemoveErrorMessage: PropTypes.string
  }

  static contextTypes = {
    dropdownAlert: PropTypes.object
  }

  constructor(props) {
    super(props);

    const rowHasChanged = (r1, r2) => r1 !== r2;
    this.ds = new ListView.DataSource({rowHasChanged});

    this.initialState = immutable({
      stopId: null,
      measure: null,
      unit: null,
      preference: null,
      title: '',
      infoText: null,
      options: [{}],
      listSize: 4,
      selectedValue: null
    });

    this.state = {
      ...this.initialState,
      optionsDataSource: this.ds.cloneWithRows([{}])
    };
    this.modal = null;
  }

  componentWillReceiveProps(newProps) {
    const {
      dispatch, onDone,
      notificationPreferenceAddSubmitting, notificationPreferenceAddErrorMessage, notificationPreferenceAddErrorCode,
      notificationPreferenceUpdateSubmitting, notificationPreferenceUpdateErrorMessage, notificationPreferenceUpdateErrorCode,
      notificationPreferenceRemoveSubmitting, notificationPreferenceRemoveErrorMessage, notificationPreferenceRemoveErrorCode
    } = newProps;
    const {
      notificationPreferenceAddSubmitting: oldNotificationPreferenceAddSubmitting,
      notificationPreferenceUpdateSubmitting: oldNotificationPreferenceUpdateSubmitting,
      notificationPreferenceRemoveSubmitting: oldNotificationPreferenceRemoveSubmitting
    } = this.props;

    const {measure} = this.state;

    const finishedNotificationPreferenceAdd = oldNotificationPreferenceAddSubmitting && !notificationPreferenceAddSubmitting;
    const finishedNotificationPreferenceUpdate = oldNotificationPreferenceUpdateSubmitting && !notificationPreferenceUpdateSubmitting;
    const finishedNotificationPreferenceRemove = oldNotificationPreferenceRemoveSubmitting && !notificationPreferenceRemoveSubmitting;
    if (finishedNotificationPreferenceAdd || finishedNotificationPreferenceUpdate || finishedNotificationPreferenceRemove) {
      const errorMessage = (
        finishedNotificationPreferenceAdd && (notificationPreferenceAddErrorMessage || notificationPreferenceAddErrorCode) ||
        finishedNotificationPreferenceUpdate && (notificationPreferenceUpdateErrorMessage || notificationPreferenceUpdateErrorCode) ||
        finishedNotificationPreferenceRemove && (notificationPreferenceRemoveErrorMessage || notificationPreferenceRemoveErrorCode)
      );
      if (errorMessage) {
        this.context.dropdownAlert.alert('error', i18n.t('error'), errorMessage);
      } else {
        this.handleCancelPress();
        onDone && onDone(measure);
      }
    }
  }

  handleCancelPress = () => {
    this.modal.close();
    this.setState({
      ...this.initialState,
      optionsDataSource: this.ds.cloneWithRows([{}])
    });
  }

  handleDonePress = () => {
    const {dispatch} = this.props;
    const {stopId, measure, unit, preference, selectedValue} = this.state;
    const preferenceId = get(preference, 'id', null);
    const threshold = get(preference, 'threshold', null);

    if (selectedValue !== threshold) {
      if (preferenceId) {
        if (selectedValue) {
          dispatch(actions.updateNotificationPreference({id: preferenceId, measure, unit, threshold: selectedValue}));
        } else {
          dispatch(actions.removeNotificationPreference(preferenceId));
        }
      } else if (selectedValue) {
        dispatch(actions.addNotificationPreference({stopId, measure, unit, threshold: selectedValue}));
      }
    } else {
      this.handleCancelPress();
    }
  }

  handleSelectPress = (option) => {
    const {options} = this.state;
    this.setState({selectedValue: option.value, optionsDataSource: this.ds.cloneWithRows(options)});
  }

  open = ({stopId, measure, unit, preference, title, infoText, options, listSize = this.initialState.listSize}) => {
    if (stopId && measure && unit && title && options) {
      this.setState({
        stopId,
        measure,
        unit,
        preference,
        title,
        infoText,
        options,
        listSize,
        selectedValue: get(preference, 'threshold', null),
        optionsDataSource: this.ds.cloneWithRows(options)
      });
      this.modal.open();
      trackScreenView(title);
    }
  }

  render() {
    const {notificationPreferenceAddSubmitting, notificationPreferenceUpdateSubmitting, notificationPreferenceRemoveSubmitting} = this.props;
    const {selectedValue, title, infoText, listSize, optionsDataSource} = this.state;

    const modalSubmitting = notificationPreferenceAddSubmitting || notificationPreferenceUpdateSubmitting || notificationPreferenceRemoveSubmitting;

    return (
        <Modal style={[styles.modal, {height: 160 + listSize * 50}]} position={"center"} ref={modal => {this.modal = modal}}>
            <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderText} numberOfLines={1}>{title}</Text>
            </View>
            {infoText &&
              <View style={styles.modalInfoTextContainer}>
                <Text style={styles.modalInfoText} numberOfLines={2}>{infoText}</Text>
              </View>
            }
            <ListView
                style={styles.modalList}
                dataSource={optionsDataSource}
                renderRow={option => {
                    const iconName = selectedValue === option.value ? 'dot-circle-o' : 'circle-o';
                    return (
                        <TouchableOpacity style={styles.modalListRow} onPress={this.handleSelectPress.bind(this, option)}>
                            <View style={styles.modalRowContainer}>
                              <Icon name={iconName} size={16} color={colors.darkGrey}/>
                              <View style={styles.modalListRowTextContainer}>
                                  <Text style={styles.modalListRowText}>{option.name}</Text>
                              </View>
                            </View>
                        </TouchableOpacity>
                    );
                }}
            />
            <View style={styles.modalButtonsContainer}>
                <TouchableOpacity style={styles.modalButton} onPress={this.handleCancelPress}>
                    <Text style={styles.modalButtonText}>{i18n.t('modal-cancel')}</Text>
                </TouchableOpacity>
                <View style={styles.modalButtonSplitter}></View>
                <TouchableOpacity disabled={modalSubmitting} style={styles.modalButton} onPress={this.handleDonePress}>
                    <Text style={styles.modalButtonBoldText}>{i18n.t('modal-done')}</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    notificationPreferenceAddSubmitting: state.notificationPreferences.notificationPreferenceAddSubmitting,
    notificationPreferenceAddErrorCode: state.notificationPreferences.notificationPreferenceAddErrorCode,
    notificationPreferenceAddErrorMessage: state.notificationPreferences.notificationPreferenceAddErrorMessage,
    notificationPreferenceUpdateSubmitting: state.notificationPreferences.notificationPreferenceUpdateSubmitting,
    notificationPreferenceUpdateErrorCode: state.notificationPreferences.notificationPreferenceUpdateErrorCode,
    notificationPreferenceUpdateErrorMessage: state.notificationPreferences.notificationPreferenceUpdateErrorMessage,
    notificationPreferenceRemoveSubmitting: state.notificationPreferences.notificationPreferenceRemoveSubmitting,
    notificationPreferenceRemoveErrorCode: state.notificationPreferences.notificationPreferenceRemoveErrorCode,
    notificationPreferenceRemoveErrorMessage: state.notificationPreferences.notificationPreferenceRemoveErrorMessage
  };
};

export default connect(mapStateToProps, null, null, {withRef: true})(NotificationPreferenceModal);
