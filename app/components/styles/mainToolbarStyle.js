import {StyleSheet} from 'react-native';
import {metrics, colors} from '../../themes/';

export default StyleSheet.create({
  mainToolbarContainer: {
    height: metrics.mainToolbarHeight,
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderColor: colors.grey
  },
  leftButtonContainer: {
    alignSelf: 'stretch',
    alignItems: 'center',
    flexDirection: 'row'
  },
  leftButtonTouch: {
    paddingHorizontal: 10,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center'
  },
  leftButtonText: {
    color: colors.darkGrey,
    fontWeight: '600'
  },
  titleContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0
  },
  etaUpdateTimerContainer: {
    flex: 1
  },
  title: {
    fontSize: 17,
    color: colors.darkGrey
  }
})
