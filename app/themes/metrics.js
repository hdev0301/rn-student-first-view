import {Dimensions, Platform} from 'react-native';

const {width, height} = Dimensions.get('window');

const metrics = {
  marginHorizontal: 10,
  marginVertical: 10,
  section: 25,
  baseMargin: 10,
  doubleBaseMargin: 20,
  smallMargin: 5,
  horizontalLineHeight: 1,
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,
  mainToolbarHeight: 45,
  navBarHeight: 64,
  buttonRadius: 4,
  headerTitleHeight: 50,
  firstviewBannerHeight: 100,
  firstviewHeaderImageHeight: 70,
  walkthroughSkipButtonHeight: 45,
  icons: {
    tiny: 15,
    small: 20,
    medium: 30,
    large: 45,
    xl: 60
  },
  images: {
    small: 20,
    medium: 40,
    large: 60,
    logo: 300
  },
  ...Platform.select({
    ios: {
      statusBarHeight: 20
    },
    android: {
      statusBarHeight: 0
    }
  })
};

export default metrics;
