import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Keyboard,
  LayoutAnimation,
  ListView,
  StyleSheet
} from 'react-native';
import {connect} from 'react-redux';
import validator from 'validator';
import RNApptentive from 'react-native-apptentive';
import MainToolbar from '../components/MainToolbar';
import i18n from '../i18n/i18n.js';
import actions from '../actions/creators';
import {images, metrics, colors} from '../themes';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import CustomPicker from '../components/CustomPicker';
import Modal from 'react-native-modalbox';
import styles from './styles/addStudentScreenStyle';
import {Actions as NavActions, ActionConst as NavActionConst} from 'react-native-router-flux';
import {min, get, isEqual, toUpper} from 'lodash';
import {validate} from '../utils/validationUtils';
import TextInputState from 'TextInputState';
import dismissKeyboard from 'dismissKeyboard';
import Icon from 'react-native-vector-icons/FontAwesome';
import {trackScreenView} from '../services/googleAnalytics';

class AddStudentScreen extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    states: PropTypes.array,
    districts: PropTypes.object,
    statesAndDistrictsFetching: PropTypes.bool,
    statesAndDistrictsErrorCode: PropTypes.number,
    studentAddSubmitting: PropTypes.bool,
    studentAddErrorCode: PropTypes.number,
    studentAddErrorMessage: PropTypes.string,
    previousPage: PropTypes.string
  }

  static defaultProps = {
    previousPage: 'profile'
  }

  static contextTypes = {
    drawer: PropTypes.object,
    dropdownAlert: PropTypes.object
  }

  constructor(props) {
    super(props);

    this.formConstraints = {
      state: (value) => {
        if (!value) {
          return i18n.t('validationPresence');
        }
        return null;
      },
      district: (value) => {
        if (!value) {
          return i18n.t('validationPresence');
        }
        return null;
      },
      studentNumber: (value) => {
        if (!value) {
          return i18n.t('validationPresence');
        }
        const minLength = 1;
        const maxLength = 12;
        if (!validator.isLength(value, {min: minLength, max: maxLength})) {
          return i18n.t('validationStringLength').replace('{0}', minLength).replace('{1}', maxLength);
        }
        return null;
      },
      securityCode: (value, form) => {
        const isSecurityCodeRequired = get(form, 'district.settings.security_code_required', false);
        if (isSecurityCodeRequired) {
          if (!value) {
            return i18n.t('validationPresence');
          }
          const minLength = 6;
          if (!validator.isLength(value, {min: minLength})) {
            return i18n.t('validationAlphanumericMinLength').replace('{0}', minLength);
          }
          if (!validator.isAlphanumeric(value)) {
            return i18n.t('validationAlphanumeric');
          }
        }
        return null;
      }
    };

    const rowHasChanged = (r1, r2) => r1 !== r2;
    this.ds = new ListView.DataSource({rowHasChanged});

    this.state = {
      form: {
        state: null,
        district: null,
        studentNumber: null,
        securityCode: null
      },
      formErrors: null,
      visibleHeight: this.getScrollViewHeight(),
      stateDataSource: this.ds.cloneWithRows([]),
      districtDataSource: this.ds.cloneWithRows([]),
      stateArrowShow: true,
      modalArrowShow: true
    };
    this.stateModal = null;
    this.districtModal = null;

    this.title = i18n.t('addStudent');
  }

  componentWillMount() {
    // Using keyboardWillShow/Hide looks 1,000 times better, but doesn't work on Android
    // TODO: Revisit this if Android begins to support - https://github.com/facebook/react-native/issues/3468
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(actions.getStatesAndDistricts());
    trackScreenView(this.title);
  }

  componentWillReceiveProps(newProps) {
    const {statesAndDistrictsFetching, states, studentAddSubmitting, studentAddErrorMessage, studentAddErrorCode, previousPage} = newProps;
    const {statesAndDistrictsFetching: oldStatesAndDistrictsFetching, states: oldStates, studentAddSubmitting: oldStudentAddSubmitting} = this.props;
    const {form} = this.state;

    if (oldStatesAndDistrictsFetching && !statesAndDistrictsFetching && !isEqual(oldStates, states)) {
      this.setState({
        stateDataSource: this.ds.cloneWithRows(states),
        districtDataSource: this.ds.cloneWithRows([]),
        form: {...form, state: null, district: null}
      });
    }

    if (oldStudentAddSubmitting && !studentAddSubmitting) {
      const errorMessage = studentAddErrorMessage || studentAddErrorCode;
      if (errorMessage) {
        this.context.dropdownAlert.alert('error', i18n.t('error'), errorMessage);
      } else {
        RNApptentive.engage('follow_a_stop_done');
        NavActions[previousPage]({type: NavActionConst.RESET});
      }
    }
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  keyboardDidShow = (e) => {
    // Animation types easeInEaseOut/linear/spring
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    let newSize = this.getScrollViewHeight() - e.endCoordinates.height;
    this.setState({
      visibleHeight: newSize
    });
  }

  keyboardDidHide = (e) => {
    // Animation types easeInEaseOut/linear/spring
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({
      visibleHeight: this.getScrollViewHeight()
    });
  }

  handlePressAddStudent = () => {
    const {form} = this.state;
    const formErrors = validate(form, this.formConstraints);
    this.setState({formErrors});
    if (!formErrors) {
      const {dispatch} = this.props;
      const {state: {id: stateId}, district: {id: districtId}, studentNumber, securityCode} = form;
      dispatch(actions.addStudent({stateId, districtId, studentNumber, securityCode}));
    }
  }

  handleBack = () => {
    RNApptentive.engage('follow_a_stop_back');
    NavActions.pop();
  };

  handlePressStatePicker = () => {
    if (this.state.stateDataSource.getRowCount()) {
      this.setState({stateArrowShow: true});
      this.stateModal.open();
    }
  };

  handlePressDistrictPicker = () => {
    if (this.state.districtDataSource.getRowCount()) {
      this.setState({districtArrowShow: true});
      this.districtModal.open();
    }
  };

  handlePressStateSelect = (state) => {
    const {form} = this.state;
    const districts = get(this.props.districts, state.id, []);
    this.setState({districtDataSource: this.ds.cloneWithRows(districts), form: {...form, state, district: null, studentNumber: '', securityCode: ''}});
    this.stateModal.close();
  };

  handlePressDistrictSelect = (district) => {
    const {form} = this.state;
    this.setState({form: {...form, district, studentNumber: '', securityCode: ''}});
    this.districtModal.close();
  };

  handleCapture = (e) => {
    const focusField = TextInputState.currentlyFocusedField();
    const target = e.nativeEvent.target;
    if (focusField != null && target != focusField) {
      const {studentNumber} = this.refs;
      const inputs = [studentNumber.getNodeHandle()];
      if (inputs && inputs.indexOf(target) === -1) {
        dismissKeyboard();
      }
    }
  };

  getScrollViewHeight = () => {
    return metrics.screenHeight - metrics.mainToolbarHeight - metrics.statusBarHeight;
  }

  render() {
    const {form, formErrors, stateArrowShow, stateDataSource, districtArrowShow, districtDataSource} = this.state;
    const {state, district} = form;
    const {statesAndDistrictsFetching, studentAddSubmitting} = this.props;
    const attempting = statesAndDistrictsFetching || studentAddSubmitting;

    const stateModalStyle = StyleSheet.flatten([styles.modal, {height: min([this.state.stateDataSource.getRowCount() * 50 + 30, 230])}]);
    const districtModalStyle = StyleSheet.flatten([styles.modal, {height: min([this.state.districtDataSource.getRowCount() * 50 + 30, 230])}]);

    const stateValue = get(state, 'name');
    const districtValue = get(district, 'name');
    const isSecurityCodeRequired = get(district, 'settings.security_code_required', false);

    const showStateArrow = stateArrowShow && stateDataSource.getRowCount() > 4;
    const showDistrictArrow = districtArrowShow && districtDataSource.getRowCount() > 4;

    return (
      <View style={[styles.mainContainer]} onStartShouldSetResponderCapture={this.handleCapture}>
        <MainToolbar title={this.title} leftButton={{icon: 'chevron-left', onPress: this.handleBack}}/>
        <ScrollView
          contentContainerStyle={{justifyContent: 'center', alignItems: 'center', paddingVertical: 50}}
          style={[styles.scrollView, {height: this.state.visibleHeight}]}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
        >
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoText}>{i18n.t('addStudentInfo')}</Text>
          </View>
          <View style={styles.inputsContainer}>
            <View style={styles.inputsWrapper}>
              <CustomPicker
                icon="globe"
                error={get(formErrors, 'state')}
                placeholder={i18n.t('placeholder-state')}
                value={stateValue}
                onPress={this.handlePressStatePicker}
              />
              <CustomPicker
                icon="globe"
                error={get(formErrors, 'district')}
                placeholder={i18n.t('placeholder-district')}
                value={districtValue}
                onPress={this.handlePressDistrictPicker}
              />
              <CustomTextInput ref="studentNumber" icon="user" error={get(formErrors, 'studentNumber')} textInput={{
                  keyboardType: 'default',
                  placeholder: i18n.t('placeholder-studentId'),
                  onChangeText: studentNumber => this.setState({form: {...form, studentNumber}}),
                  editable: !attempting,
                  value: form.studentNumber
              }}/>
              {isSecurityCodeRequired && (
                  <CustomTextInput ref="securityCode" icon="shield" error={get(formErrors, 'securityCode')} textInput={{
                      keyboardType: 'default',
                      placeholder: i18n.t('placeholder-securityCode'),
                      onChangeText: securityCode => this.setState({form: {...form, securityCode: toUpper(securityCode)}}),
                      autoCapitalize: 'characters',
                      editable: !attempting,
                      value: form.securityCode
                  }}/>
              )}
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton onPress={this.handlePressAddStudent} label={i18n.t('addStudentButton')} showSpinner={studentAddSubmitting}/>
          </View>
          <View style={styles.cancelLinkContainer}>
            <Text>{i18n.t('or')}</Text>
            <TouchableOpacity style={styles.cancelLinkWrapper} onPress={this.handleBack}>
              <Text style={styles.cancelLink}>{i18n.t('cancelLink')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Modal style={stateModalStyle} position={"center"} ref={modal => {this.stateModal = modal}}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}>{i18n.t('modal-stateHeader')}</Text>
          </View>
          <ListView
            dataSource={stateDataSource}
            renderRow={state => {
              return (
                <TouchableHighlight
                  underlayColor={colors.lightGrey}
                  onPress={this.handlePressStateSelect.bind(this, state)}>
                  <View style={styles.modalListRow}>
                    <Text style={styles.modalListRowText}>{state.name}</Text>
                  </View>
                </TouchableHighlight>
              );
            }}
            onScroll={(event) => {
              const contentSizeHeight = event.nativeEvent.contentSize.height;
              const layoutMeasurementHeight = event.nativeEvent.layoutMeasurement.height;
              const contentOffsetY = event.nativeEvent.contentOffset.y;
              const showArrow = contentSizeHeight - layoutMeasurementHeight - contentOffsetY > 10;
              this.setState({stateArrowShow: showArrow});
            }}
          />
          {showStateArrow && (
            <Icon
              name="arrow-circle-o-down"
              size={18}
              color={colors.darkerGrey}
              style={styles.modalListScrollArrow}
            />
          )}
        </Modal>
        <Modal style={districtModalStyle} position={"center"} ref={modal => {this.districtModal = modal}}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}>{i18n.t('modal-districtHeader')}</Text>
          </View>
          <ListView
            dataSource={districtDataSource}
            renderRow={district => {
              return (
                <TouchableHighlight
                  underlayColor={colors.lightGrey}
                  onPress={this.handlePressDistrictSelect.bind(this, district)}
                >
                  <View style={styles.modalListRow}>
                    <Text style={styles.modalListRowText}>{district.name}</Text>
                  </View>
                </TouchableHighlight>
              );
            }}
            onScroll={(event) => {
              const contentSizeHeight = event.nativeEvent.contentSize.height;
              const layoutMeasurementHeight = event.nativeEvent.layoutMeasurement.height;
              const contentOffsetY = event.nativeEvent.contentOffset.y;
              const showArrow = contentSizeHeight - layoutMeasurementHeight - contentOffsetY > 10;
              this.setState({modalArrowShow: showArrow});
            }}
          />
          {showDistrictArrow && (
            <Icon
              name="arrow-circle-o-down"
              size={18}
              color={colors.darkerGrey}
              style={styles.modalListScrollArrow}
            />
          )}
        </Modal>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    states: state.register.states,
    districts: state.register.districts,
    statesAndDistrictsFetching: state.register.statesAndDistrictsFetching,
    statesAndDistrictsErrorCode: state.register.statesAndDistrictsErrorCode,
    studentAddSubmitting: state.students.studentAddSubmitting,
    studentAddErrorCode: state.students.studentAddErrorCode,
    studentAddErrorMessage: state.students.studentAddErrorMessage
  }
};

export default connect(mapStateToProps)(AddStudentScreen);
