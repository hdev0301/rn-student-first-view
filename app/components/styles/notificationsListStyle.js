import {StyleSheet} from 'react-native';
import {colors} from '../../themes/';

export default StyleSheet.create({
  listRow: {
    paddingVertical: 5,
    borderColor: colors.grey,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1,
    flexDirection: 'row'
  },
  listRowBellIconContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center'
  },
  listRowDetails: {
    flex: 1,
    flexDirection: 'row',
  },
  listRowDetailsContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  listRowRemoveIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15
  },
  notificationDetailTitle: {
    fontWeight: '500',
    marginTop: 4,
    marginBottom: 2,
    fontSize: 16
  },
  notificationDetailContent: {
    marginVertical: 2
  },
  notificationDetailDate: {
    color: colors.darkGrey,
    textAlign: 'right',
    marginTop: 2,
    marginBottom: 4
  },
  removeButton: {
    paddingHorizontal: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});
