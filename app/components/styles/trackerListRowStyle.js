import {StyleSheet, Platform} from 'react-native';
import {colors} from '../../themes/';

export default StyleSheet.create({
  listColumn: {
    borderLeftWidth: 8,
    borderTopWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 1,
    borderColor: colors.grey,
    flexDirection: 'column',
  },
  listRow: {
    flexDirection: 'row'
  },
  listRowMinutesContainerWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'flex-start',
    width: 97
  },
  listRowMinutesContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    width: 97
  },
  listRowSchoolTimeContainer: {
    alignItems: 'flex-end',
    paddingVertical: 6,
    width: 97
  },
  listRowMinutesIcon: {
    paddingBottom: 5
  },
  listRowMinutes: {
    fontSize: 35
  },
  listRowMinutesLabelContainer: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  listRowMinutesLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.white
  },
  listRowDetailsContainer: {
    flex: 1
  },
  listRowDetailsTopContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 0,
    height: 93
  },
  listRowDetailsTimeLabelContainer: {
    marginLeft: 5,
    marginVertical: 3,
    paddingBottom: 3,
    borderLeftWidth: 1,
    borderColor: colors.grey
  },
  listRowDetailsTimeLabel: {
    fontWeight: '500',
    marginLeft: 12,
    fontSize: 12
  },
  listRowDetailsTimeValueContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  listRowDetailsTimeValue: {
    marginLeft: 6,
    fontWeight: '500',
    fontSize: 20
  },
  listRowDetailsTimePeriodContainer: {
    marginLeft: 5,
    marginVertical: 2,
    paddingTop: 2,
    borderLeftWidth: 1,
    borderColor: colors.grey
  },
  listRowDetailsTimePeriod: {
    color: colors.darkerGrey,
    fontWeight: '500',
    marginLeft: 12,
    fontSize: 13
  },
  listRowDetailsStopInfoContainer: {
    paddingHorizontal: 10,
    flex: 1
  },
  listRowDetailsStopInfoBorderContainer: {
    marginLeft: 4,
    marginVertical: 3,
    paddingTop: 3,
    borderLeftWidth: 1,
    borderColor: colors.grey
  },
  listRowDetailsSchoolIconNameContainer: {
    flexDirection: 'row',
  },
  listRowDetailsStopInfoValueContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  listRowDetailsStopInfoValue: {
    marginLeft: 6,
    fontWeight: '500',
    fontSize: 16,
    flex: 1
  },
  listRowDetailsStopInfoAddress: {
    color: colors.darkerGrey,
    fontWeight: '500',
    marginLeft: 12,
    fontSize: 13,
    flex: 1
  },
  listRowDetailsBottomContainer: {
    paddingRight: 10,
    paddingVertical: 2,
    flex: 1,
    justifyContent: 'center',
    height: 40
  },
  listRowDetailsBottomContent: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: colors.grey,
    alignItems: 'center',
    height: 38
  },
  listRowDetailsBottomText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.darkGrey,
    marginLeft: 6,
    flex: 1
  },
  schoolTimeWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  schoolTimeContainer: {
    borderWidth: 1,
    paddingHorizontal: 3,
    paddingVertical: 3,
    alignItems: 'center',
    justifyContent: 'center',
    width: 86,
  },
  schoolTimeLabel: {
    fontSize: 10,
    fontWeight: 'bold'
  },
  schoolTimeText: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.darkGrey,
    top: Platform.select({ios: -2, android: -4})
  },
  schoolTimeArrow: {
    transform: [{rotate: '45deg'}],
    borderTopWidth: 1,
    borderRightWidth: 1,
    width: 6,
    height: 6,
    left: -3,
    backgroundColor: colors.white
  },
  infoIcon: {
    width: 25,
    height: 25
  },
  infoTextRow: {
    backgroundColor: colors.red,
    paddingHorizontal: 10,
    paddingVertical: 2   
  },
  infoText: {
    color: colors.white,
    fontSize: 12,
    textAlign: 'center'
  },
  absoluteContainer: {
    position: 'absolute',
    alignItems: 'center',
  }
});
