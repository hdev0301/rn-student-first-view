import {StyleSheet} from 'react-native';
import {colors} from '../../themes';

export default StyleSheet.create({
  buttonWrapper: {
    flex: 1,
    flexDirection: 'row'
  },
  button: {
    flex: 1,
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold'
  },
  activityIndicator: {
    paddingHorizontal: 10
  }
});
