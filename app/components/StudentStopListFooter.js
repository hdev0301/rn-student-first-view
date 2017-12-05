import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import {images} from '../themes';
import styles from './styles/studentStopListFooterStyle';

const StudentStopListFooter = (props) => (
  <View>
    <View style={styles.trackerListFooterContainer}>
      <Image source={images.firstviewFooterBanner} style={styles.trackerListFooterImage}/>
    </View>
  </View>
);

export default StudentStopListFooter;
