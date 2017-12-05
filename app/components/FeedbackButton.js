import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {images} from '../themes/';
import styles from './styles/feedbackButtonStyle';

export default class FeedbackButton extends Component {
  static propTypes = {
    onPress: PropTypes.func
  }

  render() {
    const {onPress} = this.props;

    return (
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.touchableContainer} onPress={onPress}>
          <Image source={images.feedbackIcon} style={styles.feedbackIcon}/>
        </TouchableOpacity>
      </View>
    )
  }
}
