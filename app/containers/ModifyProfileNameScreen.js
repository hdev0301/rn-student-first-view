import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  ScrollView,
  Text,
  Keyboard,
  LayoutAnimation
} from 'react-native';
import {connect} from 'react-redux';
import validator from 'validator';
import MainToolbar from '../components/MainToolbar';
import i18n from '../i18n/i18n.js';
import actions from '../actions/creators';
import {metrics} from '../themes';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import {Actions as NavActions, ActionConst as NavActionConst} from 'react-native-router-flux';
import {get} from 'lodash';
import {validate} from '../utils/validationUtils';
import TextInputState from 'TextInputState';
import dismissKeyboard from 'dismissKeyboard';
import {trackScreenView} from '../services/googleAnalytics';
import styles from './styles/modifyScreenStyle';

class ModifyProfileNameScreen extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    profile: PropTypes.object,
    onDone: PropTypes.func,
    profileUpdateSubmitting: PropTypes.bool,
    profileUpdateErrorCode: PropTypes.number,
    profileUpdateErrorMessage: PropTypes.string
  }

  static contextTypes = {
    drawer: PropTypes.object,
    dropdownAlert: PropTypes.object
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
      }
    };

    this.state = {
      form: {
        firstName: get(props, 'profile.first_name'),
        lastName: get(props, 'profile.last_name'),
      },
      formErrors: null,
      visibleHeight: this.getScrollViewHeight(),
    };

    this.title = i18n.t('modifyProfileName');
    this.info = i18n.t('modifyProfileName-info');
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
    const {onDone, profileUpdateSubmitting, profileUpdateErrorMessage, profileUpdateErrorCode} = newProps;
    const {profileUpdateSubmitting: oldProfileUpdateSubmitting} = this.props;

    if (oldProfileUpdateSubmitting && !profileUpdateSubmitting) {
      const errorMessage = profileUpdateErrorMessage || profileUpdateErrorCode;
      if (errorMessage) {
        this.context.dropdownAlert.alert('error', i18n.t('error'), errorMessage);
      } else {
        NavActions.profile({type: NavActionConst.BACK});
        onDone && onDone();
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
  };

  keyboardDidHide = (e) => {
    // Animation types easeInEaseOut/linear/spring
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({
      visibleHeight: this.getScrollViewHeight()
    });
  };

  handlePressSubmitProfileName = () => {
    const {form} = this.state;
    const formErrors = validate(form, this.formConstraints);
    this.setState({formErrors});
    if (!formErrors) {
      const {dispatch, profile: {phone}} = this.props;
      const {firstName, lastName} = form;
      dispatch(actions.updateProfile({firstName, lastName, phone}));
    }
  };

  handleBack = () => {
    NavActions.profile({type: NavActionConst.BACK});
  };

  handleCapture = (e) => {
    const focusField = TextInputState.currentlyFocusedField();
    const target = e.nativeEvent.target;
    if (focusField != null && target != focusField) {
      const {firstName, lastName} = this.refs;
      const inputs = [firstName.getNodeHandle(), lastName.getNodeHandle()];
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
    const {firstName, lastName} = form;
    const {profileUpdateSubmitting: attempting} = this.props;

    return (
      <View style={styles.mainContainer} onStartShouldSetResponderCapture={this.handleCapture}>
        <MainToolbar title={this.title} leftButton={{text: i18n.t('mainToolbar-cancel'), onPress: this.handleBack}}/>
        <ScrollView
          contentContainerStyle={{justifyContent: 'center', alignItems: 'center', paddingVertical: 50}}
          style={[styles.scrollView, {height: this.state.visibleHeight}]}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
        >
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoText}>{this.info}</Text>
          </View>
          <View style={styles.inputsContainer}>
            <View style={styles.inputsWrapper}>
              <CustomTextInput ref="firstName" icon="user" error={get(formErrors, 'firstName')} textInput={{
                  autoCapitalize: 'words',
                  placeholder: i18n.t('placeholder-firstName'),
                  defaultValue: firstName,
                  onChangeText: firstName => this.setState({form: {...form, firstName}}),
                  editable: !attempting
              }}/>
              <CustomTextInput ref="lastName" icon="user" error={get(formErrors, 'lastName')} textInput={{
                  autoCapitalize: 'words',
                  placeholder: i18n.t('placeholder-lastName'),
                  defaultValue: lastName,
                  onChangeText: lastName => this.setState({form: {...form, lastName}}),
                  editable: !attempting
              }}/>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton onPress={this.handlePressSubmitProfileName} label={i18n.t('modifyProfileName-done')} showSpinner={attempting}/>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    profileUpdateSubmitting: state.profile.profileUpdateSubmitting,
    profileUpdateErrorCode: state.profile.profileUpdateErrorCode,
    profileUpdateErrorMessage: state.profile.profileUpdateErrorMessage
  }
};

export default connect(mapStateToProps)(ModifyProfileNameScreen);
