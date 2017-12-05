import {StyleSheet} from 'react-native';
import {colors, applicationStyles} from '../../themes/';

export default StyleSheet.create({
  mainContainer: {
      ...applicationStyles.screen.mainContainer,
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: colors.transparent
  }
});
