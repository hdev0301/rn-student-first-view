import {StyleSheet} from 'react-native';
import {colors, metrics, applicationStyles} from '../../themes';

export default StyleSheet.create({
  ...applicationStyles.screen,
  districtLogoContainer: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  districtLogoBadge: {
    width: 260,
    height: 260,
    paddingVertical: 20,
    resizeMode: 'stretch'
  },
  listRowDetailsStopInfoBorderContainer: {
    marginLeft: 4,
    marginVertical: 3,
    paddingTop: 3,
    borderLeftWidth: 1,
    borderColor: colors.grey
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
    fontSize: 12
  },
  districtColourOne: {
    borderColor: '#1f3fa7',
    borderTopWidth: 5
  },
  districtColourTwo: {
    borderColor: '#080304',
    borderTopWidth: 5
  },
  scrollView: {
    flex: 1,
    paddingVertical: 10
  },
  actionContainer: {
    backgroundColor: colors.white,
    marginVertical: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  actionIconContainer: {
    width: 60,
    alignItems: 'center'
  },
  actionButtonsContainer: {
    paddingRight: 60,
    flex: 1
  },
  buttonContainer: {
    paddingVertical: 5,
    flex: 1
  },
  removeButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row'
  },
  padded: {
    marginHorizontal: 20
  }
});
