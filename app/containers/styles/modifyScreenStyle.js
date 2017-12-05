import {StyleSheet} from 'react-native';
import {colors, applicationStyles} from '../../themes';

export default StyleSheet.create({
  ...applicationStyles.screen,
  scrollView: {
    paddingHorizontal: 40,
    backgroundColor: colors.lightGrey
  },
  infoTextContainer: {
    paddingBottom: 10,
    width: 200
  },
  infoText: {
    fontSize: 14,
    color: colors.darkGrey,
    textAlign: 'center'
  },
  inputsContainer: {
    flexDirection: 'row'
  },
  inputsWrapper: {
    flex: 1
  },
  buttonContainer: {
    flexDirection: 'row',
    flex: 1,
    marginVertical: 25
  }
});
