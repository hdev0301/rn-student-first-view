import {StyleSheet} from 'react-native';
import {colors, metrics} from '../../themes';
import {min} from 'lodash';

export default StyleSheet.create({
  modal: {
    height: 160,
    paddingTop: 25,
    paddingHorizontal: 25,
    width: min([300, 0.8 * metrics.screenWidth]),
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.grey,
    backgroundColor: colors.white,
    flexDirection: 'column'
  },
  modalMessage: {
    justifyContent: 'center',
    flex: 1
  },
  modalMessageText: {
    color: colors.darkGrey,
    fontWeight: '600',
    textAlign: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 25
  }
});
