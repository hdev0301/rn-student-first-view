import {StyleSheet} from 'react-native';
import {colors, metrics, applicationStyles} from '../../themes';

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
  cancelLinkContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  cancelLinkWrapper: {
    paddingLeft: 5
  },
  cancelLink: {
    textDecorationLine: 'underline',
    color: colors.darkBlue
  },
  inputsContainer: {
    flexDirection: 'row'
  },
  inputsWrapper: {
    flex: 1
  },
  modal: {
    height: 100,
    width: metrics.screenWidth - 40,
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.darkBlue
  },
  modalHeader: {
    height: 30,
    backgroundColor: colors.darkBlue,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalHeaderText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 12
  },
  modalListRow: {
    borderColor: colors.grey,
    borderBottomWidth: 2,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50
  },
  modalListRowText: {
    fontSize: 18,
    color: colors.darkGrey
  },
  modalListScrollArrow: {
    position: 'absolute',
    right: 5,
    bottom: 5
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 25
  }
});
