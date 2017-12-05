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
import {metrics, colors} from '../themes';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import {Actions as NavActions, ActionConst as NavActionConst} from 'react-native-router-flux';
import {get} from 'lodash';
import {validate} from '../utils/validationUtils';
import TextInputState from 'TextInputState';
import dismissKeyboard from 'dismissKeyboard';
import {trackScreenView} from '../services/googleAnalytics';
import styles from './styles/modifyRecipientScreenStyle';

class ModifyRecipientScreen extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    recipient: PropTypes.object,
    onDone: PropTypes.func,
    recipientAddSubmitting: PropTypes.bool,
    recipientAddErrorCode: PropTypes.number,
    recipientAddErrorMessage: PropTypes.string,
    recipientUpdateSubmitting: PropTypes.bool,
    recipientUpdateErrorCode: PropTypes.number,
    recipientUpdateErrorMessage: PropTypes.string,
    recipientRemoveSubmitting: PropTypes.bool,
    recipientRemoveErrorCode: PropTypes.number,
    recipientRemoveErrorMessage: PropTypes.string
  }

  static contextTypes = {
    drawer: PropTypes.object,
    dropdownAlert: PropTypes.object
  }

  constructor(props) {
    super(props);

    this.formConstraints = {
      name: (value) => {
        if (!value) {
          return i18n.t('validationPresence');
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
      }
    };

    this.state = {
      form: {
        name: get(props, 'recipient.name'),
        email: get(props, 'recipient.email'),
      },
      formErrors: null,
      visibleHeight: this.getScrollViewHeight(),
    };

    const isEditMode = this.isEditMode(props);
    this.title = isEditMode ? i18n.t('modifyRecipient-edit') : i18n.t('modifyRecipient-add');
    this.info = isEditMode ? i18n.t('modifyRecipient-infoEdit') : i18n.t('modifyRecipient-infoAdd');
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
    const {
      dispatch, onDone,
      recipientAddSubmitting, recipientAddErrorMessage, recipientAddErrorCode,
      recipientUpdateSubmitting, recipientUpdateErrorMessage, recipientUpdateErrorCode,
      recipientRemoveSubmitting, recipientRemoveErrorMessage, recipientRemoveErrorCode
    } = newProps;
    const {
      recipientAddSubmitting: oldRecipientAddSubmitting,
      recipientUpdateSubmitting: oldRecipientUpdateSubmitting,
      recipientRemoveSubmitting: oldRecipientRemoveSubmitting
    } = this.props;

    const finishedRecipientAdd = oldRecipientAddSubmitting && !recipientAddSubmitting;
    const finishedRecipientUpdate = oldRecipientUpdateSubmitting && !recipientUpdateSubmitting;
    const finishedRecipientRemove = oldRecipientRemoveSubmitting && !recipientRemoveSubmitting;
    if (finishedRecipientAdd || finishedRecipientUpdate || finishedRecipientRemove) {
      const errorMessage = (
        finishedRecipientAdd && (recipientAddErrorMessage || recipientAddErrorCode) ||
        finishedRecipientUpdate && (recipientUpdateErrorMessage || recipientUpdateErrorCode) ||
        finishedRecipientRemove && (recipientRemoveErrorMessage || recipientRemoveErrorCode)
      );
      if (errorMessage) {
        this.context.dropdownAlert.alert('error', i18n.t('error'), errorMessage);
      } else {
        NavActions.notificationRecipients({type: NavActionConst.BACK});
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
  }

  keyboardDidHide = (e) => {
    // Animation types easeInEaseOut/linear/spring
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({
      visibleHeight: this.getScrollViewHeight()
    });
  }

  isEditMode = (props) => {
    return !!get(props, 'recipient.id');
  }

  handlePressSubmitRecipient = () => {
    const {form} = this.state;
    const formErrors = validate(form, this.formConstraints);
    this.setState({formErrors});
    if (!formErrors) {
      const {dispatch, recipient} = this.props;
      const {name, email} = form;
      const id = get(recipient, 'id');
      if (id) {
        dispatch(actions.updateNotificationContact({id, name, email}));
      } else {
        dispatch(actions.addNotificationContact({name, email}));
      }
    }
  }

  handlePressRemoveRecipient = () => {
    const {dispatch, recipient} = this.props;
    const id = get(recipient, 'id');
    id && dispatch(actions.removeNotificationContact(id));
  }

  handleBack = () => {
    NavActions.notificationRecipients({type: NavActionConst.BACK});
  };

  handleCapture = (e) => {
    const focusField = TextInputState.currentlyFocusedField();
    const target = e.nativeEvent.target;
    if (focusField != null && target != focusField) {
      const {name, email} = this.refs;
      const inputs = [name.getNodeHandle(), email.getNodeHandle()];
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
    const {name, email} = form;
    const {recipient, recipientAddSubmitting, recipientUpdateSubmitting, recipientRemoveSubmitting} = this.props;
    const attempting = recipientAddSubmitting || recipientUpdateSubmitting || recipientRemoveSubmitting;

    return (
      <View style={styles.mainContainer} onStartShouldSetResponderCapture={this.handleCapture}>
        <MainToolbar title={this.title} leftButton={{icon: 'chevron-left', onPress: this.handleBack}}/>
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
              <CustomTextInput ref="name" icon="user" error={get(formErrors, 'name')} textInput={{
                  autoCapitalize: 'words',
                  placeholder: i18n.t('placeholder-name'),
                  defaultValue: name,
                  onChangeText: name => this.setState({form: {...form, name}}),
                  editable: !attempting
              }}/>
              <CustomTextInput ref="email" icon="envelope" error={get(formErrors, 'email')} textInput={{
                  keyboardType: 'email-address',
                  placeholder: i18n.t('placeholder-email'),
                  defaultValue: email,
                  onChangeText: email => this.setState({form: {...form, email}}),
                  editable: !attempting
              }}/>
            </View>
          </View>
          <View style={styles.actionButtonsContainer}>
            <View style={styles.actionButtonsWrapper}>
              <View style={styles.buttonContainer}><CustomButton onPress={this.handlePressSubmitRecipient} label={i18n.t('modifyRecipient-done')} showSpinner={recipientAddSubmitting || recipientUpdateSubmitting}/></View>
              {this.isEditMode() && <View style={styles.buttonContainer}><CustomButton onPress={this.handlePressRemoveRecipient} label={i18n.t('modifyRecipient-remove')} borderColor={colors.red} fillColor={colors.white} textColor={colors.red} showSpinner={recipientRemoveSubmitting}/></View>}
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    recipientAddSubmitting: state.notificationContacts.notificationContactAddSubmitting,
    recipientAddErrorCode: state.notificationContacts.notificationContactAddErrorCode,
    recipientAddErrorMessage: state.notificationContacts.notificationContactAddErrorMessage,
    recipientUpdateSubmitting: state.notificationContacts.notificationContactUpdateSubmitting,
    recipientUpdateErrorCode: state.notificationContacts.notificationContactUpdateErrorCode,
    recipientUpdateErrorMessage: state.notificationContacts.notificationContactUpdateErrorMessage,
    recipientRemoveSubmitting: state.notificationContacts.notificationContactRemoveSubmitting,
    recipientRemoveErrorCode: state.notificationContacts.notificationContactRemoveErrorCode,
    recipientRemoveErrorMessage: state.notificationContacts.notificationContactRemoveErrorMessage
  }
};

export default connect(mapStateToProps)(ModifyRecipientScreen);
