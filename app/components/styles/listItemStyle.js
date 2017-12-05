import {StyleSheet} from 'react-native';
import {colors} from '../../themes/';

export default StyleSheet.create({
  listItemContainer: {
    height: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderColor: colors.grey
  },
  listItemLabelContainer: {
    flex: 1
  },
  listItemLabelText: {
    color: colors.darkGrey,
    fontWeight: '600'
  },
  listItemSecondLabelText: {
    color: colors.darkerGrey,
    fontWeight: '400',
    fontSize: 12
  },
  listItemValueContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  listItemValueText: {
    color: colors.darkerGrey,
    fontWeight: '400',
    marginHorizontal: 10,
  }
})
