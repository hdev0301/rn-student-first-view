import {StyleSheet, Platform} from 'react-native';
import {colors} from '../../themes/';

export default StyleSheet.create({
  trackerListFooterContainer: {
    paddingVertical: 14,
    backgroundColor: colors.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.grey
  },
  trackerListFooterImage: {
    width: 150,
    height: 22
  }
});
