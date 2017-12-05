import {StyleSheet} from 'react-native';
import {colors, metrics, applicationStyles} from '../../themes/';

export default StyleSheet.create({
  pickerContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.grey,
    backgroundColor: colors.white,
    flexDirection: 'row'
  },
  picker: {
    height: 24,
    color: colors.darkGrey,
    position: 'absolute',
    left: 60,
    top: 10,
    right: 0,
    padding: 0
  },
  pickerImageContainer: {
    width: 45,
    height: 45,
    backgroundColor: colors.grey,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 7,
    borderBottomLeftRadius: 7
  },
  pickerTextContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  pickerText: {
    color: colors.darkGrey,
    fontSize: 18,
    marginHorizontal: 15
  },
  pickerArrowContainer: {
    width: 45,
    height: 45,
    backgroundColor: colors.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
    borderLeftWidth: 1,
    borderColor: colors.grey
  },
  errorContainer: {
    paddingVertical: 5,
    alignItems: 'center'
  },
  errorText: {
    color: colors.red
  }
})
