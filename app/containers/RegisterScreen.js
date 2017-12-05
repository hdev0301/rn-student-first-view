import React, {Component, findNodeHandle} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StatusBar,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  Keyboard,
  LayoutAnimation,
  StyleSheet
} from 'react-native';
import {connect} from 'react-redux';
import validator from 'validator';
import actions from '../actions/creators';
import {images, metrics, colors} from '../themes';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import CustomPicker from '../components/CustomPicker';
import InputInfo from '../components/InputInfo';
import i18n from '../i18n/i18n.js';
import {Actions as NavActions, ActionConst as NavActionConst} from 'react-native-router-flux';
import {get, isEqual, min, toUpper} from 'lodash';
import {validate} from '../utils/validationUtils';
import TextInputState from 'TextInputState';
import dismissKeyboard from 'dismissKeyboard';
import DropdownAlert from 'react-native-dropdownalert';
import {trackScreenView} from '../services/googleAnalytics';
import styles from './styles/registerScreenStyle';

class RegisterScreen extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    registrationSubmitting: PropTypes.bool,
    registrationErrors: PropTypes.object,
    registrationErrorCode: PropTypes.number,
    registrationErrorMessage: PropTypes.string,
    registrationSuccessMessage: PropTypes.string
  }

  constructor(props) {
    super(props);

    this.formConstraints = {
      firstName: (value) => {
        if (!value) {
          return i18n.t('validationPresence');
        }
        const minLength = 2;
        if (!validator.isLength(value, {min: minLength})) {
          return i18n.t('validationStringMinLength').replace('{0}', minLength);
        }
        return null;
      },
      lastName: (value) => {
        if (!value) {
          return i18n.t('validationPresence');
        }
        const minLength = 2;
        if (!validator.isLength(value, {min: minLength})) {
          return i18n.t('validationStringMinLength').replace('{0}', minLength);
        }
        return null;
      },
      phone: (value) => {
        if (value) {
          if (!validator.isNumeric(value)) {
            return i18n.t('validationPhone');
          }
          const minLength = 7;
          if (!validator.isLength(value, {min: minLength})) {
            return i18n.t('validationNumberMinLength').replace('{0}', minLength);
          }
        }
        return null;
      },
      email: (value) => {
        if (!value) {
          return i18n.t('validationPresence');
        }
        if (!validator.isEmail(value.trim())) {
          return i18n.t('validationEmail');
        }
        return null;
      },
      password: (value) => {
        if (!value) {
          return i18n.t('validationPresence');
        }
        return null;
      },
      passwordConfirmation: (value, form) => {
        if (!value) {
          return i18n.t('validationPresence');
        }
        if (value !== form.password) {
          return i18n.t('validationPasswordMatch');
        }
        return null;
      }
    };

    this.state = {
      form: {
        firstName: null,
        lastName: null,
        phone: null,
        email: null,
        password: null,
        passwordConfirmation: null
      },
      formErrors: null,
      visibleHeight: this.getScrollViewHeight()
    };

    this.title = i18n.t('registerTitle');
  }

  componentWillMount() {
    // Using keyboardWillShow/Hide looks 1,000 times better, but doesn't work on Android
    // TODO: Revisit this if Android begins to support - https://github.com/facebook/react-native/issues/3468
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
  }

  componentDidMount() {
    const {dispatch} = this.props;
    trackScreenView(this.title);
  }

  componentWillReceiveProps(newProps) {
    const {dispatch, registrationSubmitting, registrationErrors, registrationErrorMessage, registrationErrorCode, states, registrationSuccessMessage} = newProps;
    const {registrationSubmitting: oldRegistrationSubmitting, states: oldStates} = this.props;

    const {form} = this.state;
    if (!isEqual(oldStates, states)) {
      this.setState({
        form: {...form}
      });
    }

    if (oldRegistrationSubmitting && !registrationSubmitting) {
      if (registrationErrors) {
        this.setState({formErrors: registrationErrors});
      } else if (registrationErrorMessage || registrationErrorCode) {
        this.dropdownAlert.alert('error', i18n.t('error'), registrationErrorMessage || registrationErrorCode);
      } else if (registrationSuccessMessage) {
        NavActions.login({type: NavActionConst.REPLACE});
        dispatch(actions.setConfirmationDialogMessage(registrationSuccessMessage));
        dispatch(actions.clearRegistrationSuccessMessage());
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

  handlePressRegister = () => {
    const {registrationSubmitting} = this.props;
    const {form} = this.state;
    const formErrors = validate(form, this.formConstraints);
    this.setState({formErrors});
    if (!formErrors && !registrationSubmitting) {
      const {dispatch} = this.props;
      const {firstName, lastName, phone, email, password, passwordConfirmation} = form;
      dispatch(actions.register({firstName, lastName, phone, email, password, passwordConfirmation}));
    }
  }

  handlePressLogin = () => {
    NavActions.login({type: NavActionConst.REPLACE});
  }

  handleCapture = (e) => {
    const focusField = TextInputState.currentlyFocusedField();
    const target = e.nativeEvent.target;
    if (focusField != null && target != focusField) {
      const {firstName, lastName, phone, email, password, passwordConfirmation} = this.refs;
      const inputs = [firstName.getNodeHandle(), lastName.getNodeHandle(), phone.getNodeHandle(), email.getNodeHandle(), password.getNodeHandle(), passwordConfirmation.getNodeHandle()];
      if (inputs && inputs.indexOf(target) === -1) {
        dismissKeyboard();
      }
    }
  };

  getScrollViewHeight = () => {
    return metrics.screenHeight - metrics.headerTitleHeight - metrics.firstviewBannerHeight - metrics.statusBarHeight
  }

  render() {
    const {form, formErrors} = this.state;
    const {registrationSubmitting} = this.props;
    const attempting = registrationSubmitting;

    return (
      <View style={styles.mainContainer} onStartShouldSetResponderCapture={this.handleCapture}>
        <DropdownAlert ref={(c) => this.dropdownAlert = c} />
        <StatusBar barStyle='default' backgroundColor={colors.darkGrey}/>
        <View style={styles.firstviewHeader}>
          <Image source={images.firstviewBanner} style={styles.firstviewHeaderImage}/>
        </View>
        <ScrollView
          contentContainerStyle={{justifyContent: 'center', alignItems: 'center', paddingTop: 10, paddingBottom: 50}}
          style={[styles.scrollView, {height: this.state.visibleHeight}]}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
        >
          <View style={styles.titleTextContainer}>
            <Text style={styles.titleText}>{this.title}</Text>
          </View>
          <View>
            <Text style={styles.infoText}>{i18n.t('registerInfo')}</Text>
          </View>
          <View style={styles.inputsContainer}>
            <View style={styles.inputsWrapper}>
              <CustomTextInput ref="firstName" icon="user" error={get(formErrors, 'firstName')} textInput={{
                  autoCapitalize: 'words',
                  placeholder: i18n.t('placeholder-firstName'),
                  onChangeText: firstName => this.setState({form: {...form, firstName}}),
                  editable: !attempting
              }}/>
              <CustomTextInput ref="lastName" icon="user" error={get(formErrors, 'lastName')} textInput={{
                  autoCapitalize: 'words',
                  placeholder: i18n.t('placeholder-lastName'),
                  onChangeText: lastName => this.setState({form: {...form, lastName}}),
                  editable: !attempting
              }}/>
              <CustomTextInput ref="phone" icon="phone" error={get(formErrors, 'phone')} textInput={{
                  keyboardType: 'phone-pad',
                  placeholder: i18n.t('placeholder-phone'),
                  onChangeText: phone => this.setState({form: {...form, phone}}),
                  editable: !attempting
              }}/>
              <CustomTextInput ref="email" icon="envelope" error={get(formErrors, 'email')} textInput={{
                  keyboardType: 'email-address',
                  placeholder: i18n.t('placeholder-email'),
                  onChangeText: email => this.setState({form: {...form, email}}),
                  editable: !attempting
              }}/>
              <CustomTextInput ref="password" icon="key" error={get(formErrors, 'password')} textInput={{
                  placeholder: i18n.t('placeholder-choosePassword'),
                  onChangeText: password => this.setState({form: {...form, password}}),
                  editable: !attempting,
                  secureTextEntry: true
              }}/>
              <CustomTextInput ref="passwordConfirmation" icon="key" error={get(formErrors, 'passwordConfirmation')} textInput={{
                  placeholder: i18n.t('placeholder-confirmPassword'),
                  onChangeText: passwordConfirmation => this.setState({form: {...form, passwordConfirmation}}),
                  editable: !attempting,
                  secureTextEntry: true
              }}/>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton onPress={this.handlePressRegister} label={i18n.t('registerButton')} showSpinner={attempting}/>
          </View>
          <View style={styles.loginLinkContainer}>
            <Text>{i18n.t('or')}</Text>
            <TouchableOpacity style={styles.loginLinkWrapper} onPress={this.handlePressLogin}>
              <Text style={styles.loginLink}>{i18n.t('loginLink')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    registrationSubmitting: state.register.registrationSubmitting,
    registrationErrorCode: state.register.registrationErrorCode,
    registrationErrors: state.register.registrationErrors,
    registrationErrorMessage: state.register.registrationErrorMessage,
    registrationSuccessMessage: state.register.registrationSuccessMessage
  };
};

export default connect(mapStateToProps)(RegisterScreen);
