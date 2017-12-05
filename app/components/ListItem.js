import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, TouchableHighlight} from 'react-native';
import {colors} from '../themes';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './styles/listItemStyle';

export default class ListItem extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    secondLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.string,
    chevron: PropTypes.bool,
    onPress: PropTypes.func
  }

  static defaultProps = {
    chevron: false,
    onPress: () => {}
  }

  render() {
    const {label, secondLabel, value, chevron, onPress} = this.props;

    return (
      <TouchableHighlight onPress={onPress} underlayColor={colors.lightGrey}>
        <View style={styles.listItemContainer}>
          <View style={styles.listItemLabelContainer}>
            <Text style={styles.listItemLabelText} numberOfLines={secondLabel ? 1 : 2}>{label}</Text>
            {secondLabel ? <Text style={styles.listItemSecondLabelText}>{secondLabel}</Text> : <View/>}
          </View>
          <View style={styles.listItemValueContainer}>
            {value ? <Text style={styles.listItemValueText} numberOfLines={2}>{value}</Text> : <View/>}
            {chevron ? <Icon name={'angle-right'} size={24} color={colors.darkerGrey}/> : <View/>}
          </View>
        </View>
      </TouchableHighlight>
    )
  }
}
