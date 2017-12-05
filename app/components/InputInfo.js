import React from 'react';
import PropTypes from 'prop-types';
import {View, Text} from 'react-native';
import {map, split, trim} from 'lodash';
import styles from './styles/inputInfoStyle';

const InputInfo = ({text}) => (
  <View style={styles.inputInfoContainer}>
    {map(split(text, '<br>'), (item, index) => <Text key={index} style={styles.inputInfoText}>{trim(item)}</Text>)}
  </View>
);

InputInfo.propTypes = {
  text: PropTypes.string
};

export default InputInfo;
