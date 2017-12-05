import {StyleSheet} from 'react-native';
import {metrics, colors} from '../../themes';

export default StyleSheet.create({
  overlay: {
    position: 'absolute',
    right: 0,
    top: metrics.mainToolbarHeight + metrics.statusBarHeight + 48,
    width: 34,
    height: 34,
    borderWidth: 1,
    borderBottomLeftRadius: 17,
    borderTopLeftRadius: 17,
    borderColor: colors.grey,
    backgroundColor: colors.white
  },
  touchableContainer: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 4
  },
  feedbackIcon: {
    width: 24,
    height: 24
  }
});
