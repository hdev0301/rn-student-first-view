import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  findNodeHandle
} from 'react-native';
import colors from '../themes/colors';
import styles from './styles/customTextAreaStyle';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class CustomTextArea extends Component {
  static propTypes = {
    textInput: PropTypes.object.isRequired,
    error: PropTypes.string
  }

  static defaultProps = {
    error: null
  }

  constructor(props) {
    super(props);
    this.state = {
      focused: false
    };
  }

  getNodeHandle() {
    return findNodeHandle(this.refs.input);
  }

  render() {
    const {textInput, error} = this.props;
    const {focused} = this.state;

    let borderColor = colors.grey;
    if (error) {
      borderColor = colors.red;
    } else if (focused) {
      borderColor = colors.darkBlue;
    }

    textInputContainerStyle = StyleSheet.flatten([styles.textInputContainer, {borderColor}]);

    const textInputProps = {
      style: styles.textInput,
      multiline: true,
      keyboardType: 'default',
      underlineColorAndroid: 'transparent',
      editable: true,
      autoCapitalize: 'none',
      autoCorrect: false,
      ref: 'input',
      placeholderTextColor: colors.darkerGrey,
      ...textInput
    };

    return (
      <View>
        <View style={textInputContainerStyle}>
          <TextInput
            {...textInputProps}
            onFocus={() => this.setState({focused: true})}
            onBlur={() => this.setState({focused: false})}
          />
        </View>
        {error && <View style={styles.errorContainer}><Text style={styles.errorText}>{error}</Text></View>}
      </View>
    )
  }
}
