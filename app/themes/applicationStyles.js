import fonts from './fonts';
import metrics from './metrics';
import colors from './colors';

// This file is for a reusable grouping of Theme items.
// Similar to an XML fragment layout in Android

const applicationStyles = {
  screen: {
    mainContainer: {
      flex: 1,
      marginTop: metrics.statusBarHeight
    },
    backgroundImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    },
    container: {
      flex: 1,
      paddingTop: metrics.baseMargin
    },
    webView: {
      marginTop: 0,
      backgroundColor: colors.lightGrey
    }
  }
};

export default applicationStyles;
