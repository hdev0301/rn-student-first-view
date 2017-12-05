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
import MainToolbar from '../components/MainToolbar';
import i18n from '../i18n/i18n.js';
import actions from '../actions/creators';
import {images, metrics, colors} from '../themes';
import CustomTextArea from '../components/CustomTextArea';
import CustomButton from '../components/CustomButton';
import {Actions as NavActions} from 'react-native-router-flux';
import {get} from 'lodash';
import {validate} from '../utils/validationUtils';
import TextInputState from 'TextInputState';
import dismissKeyboard from 'dismissKeyboard';
import DropdownAlert from 'react-native-dropdownalert';
import {trackScreenView} from '../services/googleAnalytics';
import styles from './styles/addFeedbackScreenStyle';

class AddFeedbackScreen extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    feedbackAddSubmitting: PropTypes.bool,
    feedbackAddErrorCode: PropTypes.number,
    feedbackAddErrorMessage: PropTypes.string,
    feedbackAddData: PropTypes.object
  }

  constructor(props) {
    super(props);

    this.formConstraints = {
      message: (value) => {
        if (!value) {
          return i18n.t('validationPresence');
        }
        return null;
      }
    };

    this.state = {
      form: {
        message: null
      },
      formErrors: null,
      visibleHeight: this.getScrollViewHeight()
    };

    this.title = i18n.t('addFeedback-title');
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
    const {feedbackAddSubmitting, feedbackAddErrorMessage, feedbackAddErrorCode, dispatch} = newProps;
    const {feedbackAddSubmitting: oldFeedbackAddSubmitting} = this.props;

    if (oldFeedbackAddSubmitting && !feedbackAddSubmitting) {
      if (feedbackAddErrorMessage || feedbackAddErrorCode) {
        this.dropdownAlert.alert('error', i18n.t('error'), feedbackAddErrorMessage || feedbackAddErrorCode);
      } else {
        NavActions.pop();
        dispatch(actions.setConfirmationDialogMessage(i18n.t('addFeedback-thankYou')))
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

  handlePressAddFeedback = () => {
    const {form} = this.state;
    const formErrors = validate(form, this.formConstraints);
    this.setState({formErrors});
    if (!formErrors) {
      const {dispatch} = this.props;
      const {message} = form;
      dispatch(actions.addFeedback({message}));
    }
  }

  handleCapture = (e) => {
    const focusField = TextInputState.currentlyFocusedField();
    const target = e.nativeEvent.target;
    if (focusField != null && target != focusField) {
      const {message} = this.refs;
      const inputs = [message.getNodeHandle()];
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
    const {feedbackAddSubmitting} = this.props;

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
            <Text style={styles.infoText}>{i18n.t('addFeedback-info')}</Text>
          </View>
          <View style={styles.inputsContainer}>
            <View style={styles.inputsWrapper}>
              <CustomTextArea ref="message" error={get(formErrors, 'message')} textInput={{
                  numberOfLines: 3,
                  multiline: true,
                  onChangeText: message => this.setState({form: {...form, message}}),
                  editable: !feedbackAddSubmitting
              }}/>
            </View>
          </View>
          <View style={[styles.buttonContainer]}>
            <CustomButton onPress={this.handlePressAddFeedback} label={i18n.t('addFeedback-button')} showSpinner={feedbackAddSubmitting}/>
          </View>
          <View>
            <Text style={styles.warningText}>{i18n.t('addFeedback-warning')}</Text>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    feedbackAddSubmitting: state.feedback.feedbackAddSubmitting,
    feedbackAddErrorCode: state.feedback.feedbackAddErrorCode,
    feedbackAddErrorMessage: state.feedback.feedbackAddErrorMessage,
    feedbackAddData: state.feedback.feedbackAddData
  }
};

export default connect(mapStateToProps)(AddFeedbackScreen);
