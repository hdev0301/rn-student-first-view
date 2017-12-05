import {StyleSheet} from 'react-native';
import {colors, metrics, applicationStyles} from '../../themes/';

export default StyleSheet.create({
  ...applicationStyles.screen,
  listContainer: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  noNotificationsText: {
    textAlign: 'center',
    fontSize: 22,
    color: colors.darkerGrey
  }
});
