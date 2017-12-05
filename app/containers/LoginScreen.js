import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StatusBar,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  Keyboard,
  LayoutAnimation
} from 'react-native';
import {connect} from 'react-redux';
import validator from 'validator';
import {get} from 'lodash';
import actions from '../actions/creators';
import {images, metrics, colors} from '../themes';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import i18n from '../i18n/i18n.js';
import {Actions as NavActions, ActionConst as NavActionConst} from 'react-native-router-flux';
import {validate} from '../utils/validationUtils';
import TextInputState from 'TextInputState';
import dismissKeyboard from 'dismissKeyboard';
import DropdownAlert from 'react-native-dropdownalert';
import {trackScreenView} from '../services/googleAnalytics';
import styles from './styles/loginScreenStyle';

class LoginScreen extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    loginSubmitting: PropTypes.bool,
    tokenFetching: PropTypes.bool,
    loginErrorCode: PropTypes.number,
    loginErrorMessage: PropTypes.string,
    loginProblem: PropTypes.string,
    loginSuccessMessage: PropTypes.string,
    tokenErrorCode: PropTypes.number,
    tokenProblem: PropTypes.string
  }

  constructor(props) {
    super(props);

    this.formConstraints = {
      emailOrPhone: (value) => {
        if (!value) {
          return i18n.t('validationPresence');
        }
        if (!validator.isEmail(value.trim()) && !validator.isNumeric(value)) {
          return i18n.t('validationEmailOrPhone');
        }
        return null;
      },
      password: (value) => {
        if (!value) {
          return i18n.t('validationPresence');
        }
        return null;
      }
    };

    this.state = {
      form: {
        emailOrPhone: null,
        password: null
      },
      formErrors: null,
      visibleHeight: this.getScrollViewHeight()
    };

    this.title = i18n.t('loginTitle');
  }

  componentWillMount() {
    // Using keyboardWillShow/Hide looks 1,000 times better, but doesn't work on Android
    // TODO: Revisit this if Android begins to support - https://github.com/facebook/react-native/issues/3468
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
  }

  componentDidMount() {
    trackScreenView(this.title);
  }

  componentWillReceiveProps(newProps) {
    const {loginSubmitting, loginErrorMessage, loginErrorCode, loginSuccessMessage} = newProps;
    const {loginSubmitting: oldLoginSubmitting} = this.props;

    if (oldLoginSubmitting && !loginSubmitting) {
      if (loginErrorMessage || loginErrorCode) {
        this.dropdownAlert.alert('error', i18n.t('error'), loginErrorMessage || loginErrorCode);
      } else if (loginSuccessMessage) {
        this.dropdownAlert.alert('warn', i18n.t('warning'), loginSuccessMessage);
      }
    }
  }

  handlePressPasswordForgot = () => {
    NavActions.resetPassword();
  }

  handlePressRegister = () => {
    NavActions.register({type: NavActionConst.REPLACE});
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

  handlePressLogin = () => {
    const {loginSubmitting} = this.props;
    const {form} = this.state;
    const formErrors = validate(form, this.formConstraints);
    this.setState({formErrors});
    if (!formErrors && !loginSubmitting) {
      const {dispatch} = this.props;
      const {emailOrPhone, password} = form;
      const cleanedLoginToken = emailOrPhone.trim().toLowerCase();
      dispatch(actions.login(cleanedLoginToken, password));
    }
  }

  handleCapture = (e) => {
    const focusField = TextInputState.currentlyFocusedField();
    const target = e.nativeEvent.target;
    if (focusField != null && target != focusField) {
      const {emailOrPhone, password} = this.refs;
      const inputs = [emailOrPhone.getNodeHandle(), password.getNodeHandle()];
      if (inputs && inputs.indexOf(target) === -1) {
        dismissKeyboard();
      }
    }
  }

  renderNetworkErrorInfo() {
    const {loginProblem, tokenProblem} = this.props;
    if (loginProblem === 'NETWORK_ERROR' || tokenProblem === 'NETWORK_ERROR') {
      return (
        <View style={styles.networkErrorInfoContainer}>
          <View style={styles.networkErrorInfoWrapper}>
            <Text style={styles.networkErrorInfoText}>{i18n.t('error-networkLine1')}</Text>
            <Text style={styles.networkErrorInfoText}>{i18n.t('error-networkLine2')}</Text>
          </View>
        </View>
      );
    }
  }

  getScrollViewHeight = () => {
    return metrics.screenHeight - metrics.headerTitleHeight - metrics.firstviewBannerHeight - metrics.statusBarHeight
  }

  render() {
    const {form, formErrors} = this.state;
    const {loginSubmitting, tokenFetching, loginProblem} = this.props;
    const attempting = loginSubmitting || tokenFetching;

    return (
      <View style={styles.mainContainer} onStartShouldSetResponderCapture={this.handleCapture}>
        <DropdownAlert ref={c => this.dropdownAlert = c}/>
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
          {this.renderNetworkErrorInfo()}
          <View style={styles.inputsContainer}>
            <View style={styles.inputsWrapper}>
              <CustomTextInput ref="emailOrPhone" icon="user" error={get(formErrors, 'emailOrPhone')} textInput={{
                keyboardType: 'email-address',
                placeholder: i18n.t('placeholder-emailAddress'),
                onChangeText: emailOrPhone => this.setState({form: {...form, emailOrPhone}}),
                editable: !attempting
              }}/>
              <CustomTextInput ref="password" icon="key" error={get(formErrors, 'password')} textInput={{
                placeholder: i18n.t('placeholder-password'),
                onChangeText: password => this.setState({form: {...form, password}}),
                editable: !attempting,
                secureTextEntry: true
              }}/>
            </View>
          </View>
          <View style={styles.passwordForgotLinkContainer}>
            <TouchableOpacity onPress={this.handlePressPasswordForgot}>
              <Text style={styles.passwordForgotLink}>{i18n.t('passwordForgotLink')}</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.buttonContainer]}>
            <CustomButton onPress={this.handlePressLogin} label={i18n.t('loginButton')} showSpinner={attempting}/>
          </View>
          <View style={styles.registerLinkContainer}>
            <Text>{i18n.t('or')}</Text>
            <TouchableOpacity style={styles.registerLinkWrapper} onPress={this.handlePressRegister}>
              <Text style={styles.registerLink}>{i18n.t('registerLink')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loginSubmitting: state.login.loginSubmitting,
    tokenFetching: state.login.tokenFetching,
    loginErrorCode: state.login.loginErrorCode,
    loginErrorMessage: state.login.loginErrorMessage,
    loginProblem: state.login.loginProblem,
    loginSuccessMessage: state.login.loginSuccessMessage,
    tokenErrorCode: state.login.tokenErrorCode,
    tokenProblem: state.login.tokenProblem
  };
};

export default connect(mapStateToProps)(LoginScreen);
