import {StyleSheet} from 'react-native';
import {colors} from '../../themes/';

export default StyleSheet.create({
  textInputContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.grey,
    backgroundColor: colors.white
  },
  textInput: {
    height: 44,
    color: colors.darkGrey,
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    fontSize: 18,
    paddingLeft: 60
  },
  textInputImageContainer: {
    width: 45,
    height: 45,
    backgroundColor: colors.grey,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 7,
    borderBottomLeftRadius: 7
  },
  errorContainer: {
    paddingVertical: 5,
    alignItems: 'center'
  },
  errorText: {
    color: colors.red,
    textAlign: 'center'
  }
});
