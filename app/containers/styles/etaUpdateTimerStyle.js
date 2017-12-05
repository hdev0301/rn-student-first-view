import {StyleSheet} from 'react-native';
import {colors} from '../../themes/';

export default StyleSheet.create({
  etaUpdateTimerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  timerErrorContainer: {
    paddingRight: 10
  },
  timerErrorText: {
    fontSize: 10,
    color: colors.red
  },
  timerText: {
    fontSize: 10,
    color: colors.darkGrey
  },
  progressIconContainer: {
    paddingLeft: 5,
    paddingRight: 5
  }
});
