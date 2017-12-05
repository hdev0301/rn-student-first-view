import {StyleSheet} from 'react-native';
import {Dimensions, Platform} from 'react-native';
import {colors, metrics, applicationStyles} from '../../themes/';

export default StyleSheet.create({
  mainContainer: {
    ...applicationStyles.screen.mainContainer,
    backgroundColor: colors.white,
    flex: 1
  },
  carouselContainer: {
    backgroundColor: colors.white,
    flex: 1
  },
  carouselSlide: {
    flex: 1,
    width: metrics.screenWidth,
  },
  carouselSlideImage: {
    width: metrics.screenWidth,
    height: metrics.screenHeight - metrics.statusBarHeight - metrics.walkthroughSkipButtonHeight - 200,
    resizeMode: 'stretch'
  },
  infoContainer: {
    height: 200
  },
  walkthroughHeading: {
    marginTop: 20,
    marginBottom: 10,
    color: colors.darkBlue,
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 18
  },
  walkthroughText: {
    marginHorizontal: 30,
    color: colors.textGray,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 23,
    fontWeight: '300'
  },
  skipButton: {
    height: metrics.walkthroughSkipButtonHeight,
    borderRadius: 0,
    backgroundColor: colors.darkBlue,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  skipButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.white
  }
});