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
import MainToolbar from '../components/MainToolbar';
import i18n from '../i18n/i18n.js';
import actions from '../actions/creators';
import {images, metrics, colors} from '../themes';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import styles from './styles/addFeedbackScreenStyle';
import {Actions as NavActions} from 'react-native-router-flux';
import {get} from 'lodash';
import {validate} from '../utils/validationUtils';
import TextInputState from 'TextInputState';
import dismissKeyboard from 'dismissKeyboard';
import DropdownAlert from 'react-native-dropdownalert';
import {trackScreenView} from '../services/googleAnalytics';

class ResetPasswordScreen extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    resetPasswordSubmitting: PropTypes.bool,
    resetPasswordErrorCode: PropTypes.number,
    resetPasswordErrorMessage: PropTypes.string
  }

  constructor(props) {
    super(props);

    this.formConstraints = {
      emailOrPhone: (value) => {
        if (!value) {
          return i18n.t('validationPresence');
        }
        if (!validator.isEmail(value.trim())) {
          return i18n.t('validationEmail');
        }
        return null;
      }
    };

    this.state = {
      form: {
        emailOrPhone: null
      },
      formErrors: null,
      visibleHeight: this.getScrollViewHeight()
    };

    this.title = i18n.t('resetPassword-title');
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
    const {resetPasswordSubmitting, resetPasswordErrorMessage, resetPasswordErrorCode, dispatch} = newProps;
    const {resetPasswordSubmitting: oldResetPasswordSubmitting} = this.props;

    if (oldResetPasswordSubmitting && !resetPasswordSubmitting) {
      if (resetPasswordErrorMessage || resetPasswordErrorCode) {
        this.dropdownAlert.alert('error', i18n.t('error'), resetPasswordErrorMessage || resetPasswordErrorCode);
      } else {
        NavActions.pop();
        dispatch(actions.setConfirmationDialogMessage(i18n.t('resetPassword-successful')))
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

  handlePressResetPassword = () => {
    const {form} = this.state;
    const formErrors = validate(form, this.formConstraints);
    this.setState({formErrors});
    if (!formErrors) {
      const {dispatch} = this.props;
      const {emailOrPhone} = form;
      dispatch(actions.resetPassword(emailOrPhone));
    }
  }

  handleCapture = (e) => {
    const focusField = TextInputState.currentlyFocusedField();
    const target = e.nativeEvent.target;
    if (focusField != null && target != focusField) {
      const {emailOrPhone} = this.refs;
      const inputs = [emailOrPhone.getNodeHandle()];
      if (inputs && inputs.indexOf(target) === -1) {
        dismissKeyboard();
      }
    }
  };

  getScrollViewHeight = () => {
    return metrics.screenHeight - metrics.mainToolbarHeight - metrics.statusBarHeight;
  }

  render() {
    const {form, formErrors} = this.state;
    const {resetPasswordSubmitting} = this.props;

    return (
      <View style={[styles.mainContainer]} onStartShouldSetResponderCapture={this.handleCapture}>
        <DropdownAlert ref={(c) => this.dropdownAlert = c} />
        <MainToolbar title={this.title} leftButton={{text: i18n.t('mainToolbar-cancel'), onPress: NavActions.pop}}/>
        <ScrollView
          contentContainerStyle={{justifyContent: 'center', alignItems: 'center', paddingVertical: 50}}
          style={[styles.scrollView, {height: this.state.visibleHeight}]}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
        >
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoText}>{i18n.t('resetPassword-info')}</Text>
          </View>
          <View style={styles.inputsContainer}>
            <View style={styles.inputsWrapper}>
              <CustomTextInput ref="emailOrPhone" icon="user" error={get(formErrors, 'emailOrPhone')} textInput={{
                keyboardType: 'email-address',
                placeholder: i18n.t('placeholder-emailAddress'),
                onChangeText: emailOrPhone => this.setState({form: {...form, emailOrPhone}}),
                editable: !resetPasswordSubmitting
              }}/>
            </View>
          </View>
          <View style={[styles.buttonContainer]}>
            <CustomButton onPress={this.handlePressResetPassword} label={i18n.t('resetPassword-button')} showSpinner={resetPasswordSubmitting}/>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    resetPasswordSubmitting: state.password.resetPasswordSubmitting,
    resetPasswordErrorCode: state.password.resetPasswordErrorCode,
    resetPasswordErrorMessage: state.password.resetPasswordErrorMessage
  }
};

export default connect(mapStateToProps)(ResetPasswordScreen);
