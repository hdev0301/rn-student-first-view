import React, {Component, PropTypes} from 'react'
import {View, Text, TouchableOpacity} from 'react-native'
import styles from './styles/drawerButtonStyles'
import colors from '../themes/colors';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class DrawerButton extends Component {
  static propTypes = {
    icon: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired
  }

  render() {
    const {icon, text, onPress} = this.props;
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.container}>
          <Icon name={icon} size={18} color={colors.white} style={styles.icon}/><Text style={styles.text}>{text}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}
