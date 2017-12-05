import {StyleSheet, Platform} from 'react-native';
import {colors} from '../../themes/';

export default StyleSheet.create({
  textInputContainer: {
    height: 120,
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.grey,
    backgroundColor: colors.white
  },
  textInput: {
    color: colors.darkGrey,
    position: 'absolute',
    left: 15,
    top: 10,
    right: 15,
    bottom: 10,
    fontSize: 18
  },
  errorContainer: {
    paddingVertical: 5,
    alignItems: 'center'
  },
  errorText: {
    color: colors.red
  }
});
