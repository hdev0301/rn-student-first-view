import React, {Component} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {colors} from '../themes';
import styles from './styles/startupScreenStyle';

export default class StartupScreen extends Component {
  render() {
    return (
      <View style={styles.mainContainer}>
        <ActivityIndicator color={colors.darkBlue} animating={true} size={'large'}/>
      </View>
    );
  }
};