import {StyleSheet} from 'react-native';
import {colors, metrics, applicationStyles} from '../../themes';

export default StyleSheet.create({
  ...applicationStyles.screen,
  scrollView: {
    paddingHorizontal: 40,
    backgroundColor: colors.lightGrey
  },
  firstviewHeader: {
    backgroundColor: colors.white,
    height: metrics.firstviewBannerHeight,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: colors.grey
  },
  firstviewHeaderImage: {
    width: 155,
    height: metrics.firstviewHeaderImageHeight,
    paddingVertical: 10
  },
  titleTextContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 10,
    height: metrics.headerTitleHeight
  },
  titleText: {
    fontSize: 28,
    color: colors.darkGrey
  },
  infoText: {
    fontSize: 14,
    color: colors.darkGrey
  },
  passwordForgotLinkContainer: {
    paddingVertical: 25
  },
  passwordForgotLink: {
    textDecorationLine: 'underline',
    color: colors.linkDarkBlue
  },
  loginLinkContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  loginLinkWrapper: {
    paddingLeft: 5
  },
  loginLink: {
    textDecorationLine: 'underline',
    color: colors.linkDarkBlue
  },
  inputsContainer: {
    flexDirection: 'row'
  },
  inputsWrapper: {
    flex: 1
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 25
  }
});
