import {StyleSheet} from 'react-native';
import {colors, metrics, applicationStyles} from '../../themes/';

export default StyleSheet.create({
  ...applicationStyles.screen,
  introTextContainer: {
    paddingVertical: 20,
    paddingLeft: 20,
    paddingRight: 35
  },
  introTextFirst: {
    color: colors.darkGrey,
    fontSize: 14,
    marginBottom: 6
  },
  introTextLast: {
    color: colors.darkGrey,
    fontSize: 14,
    marginTop: 6
  }
})
