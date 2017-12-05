import {StyleSheet} from 'react-native';
import {colors, metrics, applicationStyles} from '../../themes/';

export default StyleSheet.create({
  ...applicationStyles.screen,
  listView: {
    paddingTop: 30
  },
  listRow: {
    height: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: colors.grey,
    backgroundColor: colors.white
  },
  listRowTextContainer: {
    flex: 1
  },
  listRowText: {
    color: colors.darkGrey,
    fontWeight: '600'
  },
  listRowArrowContainer: {},
  introTextContainer: {
    paddingVertical: 20,
    paddingLeft: 20,
    paddingRight: 35
  },
  introText: {
    color: colors.darkGrey
  },
  pushSwitchProcessingIndicator: {
    paddingHorizontal: 10
  }
})
