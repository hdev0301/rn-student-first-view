import {StyleSheet} from 'react-native';
import {colors, metrics} from '../../themes';

export default StyleSheet.create({
  modal: {
    width: metrics.screenWidth - 80,
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.darkBlue
  },
  modalHeader: {
    height: 50,
    backgroundColor: colors.darkBlue,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalHeaderText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16
  },
  modalInfoTextContainer: {
    paddingHorizontal: 30,
    height: 60,
    justifyContent: 'center'
  },
  modalInfoText: {
    color: colors.darkGrey,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500'
  },
  modalList: {
    flex: 1,
    marginHorizontal: 30
  },
  modalListRowTextContainer: {
    paddingLeft: 10
  },
  modalListRowText: {
    fontSize: 16,
    color: colors.darkGrey,
    fontWeight: 'bold'
  },
  modalListRow: {
    borderColor: colors.grey,
    borderBottomWidth: 1,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50
  },
  modalRowContainer: {
    flexDirection: 'row', 
    width: 90,
    alignItems: 'center'
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    height: 50,
    borderTopWidth: 1,
    borderColor: colors.grey
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonSplitter: {
    width: 1,
    backgroundColor: colors.grey
  },
  modalButtonBoldText: {
    color: colors.darkBlue,
    fontSize: 16,
    fontWeight: 'bold'
  },
  modalButtonText: {
    color: colors.darkBlue,
    fontSize: 16,
    fontWeight: '400'
  }
});
