import { StyleSheet } from 'react-native';
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
  passwordForgotLinkContainer: {
    paddingTop: 25
  },
  passwordForgotLink: {
      textDecorationLine: 'underline',
      color: colors.linkDarkBlue
  },
  registerLinkContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  registerLinkWrapper: {
      paddingLeft: 5
  },
  registerLink: {
      textDecorationLine: 'underline',
      color: colors.linkDarkBlue
  },
  inputsContainer: {
      flexDirection: 'row'
  },
  inputsWrapper: {
      flex: 1
  },
  textInputContainer: {
      marginTop: 10,
      borderWidth: 1,
      borderRadius: 8,
      borderColor: colors.grey,
      backgroundColor: colors.white
  },
  textInput: {
    height: 24,
    color: colors.darkGrey,
    position: 'absolute',
    left: 60,
    top: 10,
    right: 0,
    fontSize: 18,
    padding: 0
  },
  textInputImageContainer: {
     width: 45,
     height: 45,
     backgroundColor: colors.grey,
     flex: 1,
     flexDirection:'row',
     alignItems:'center',
     justifyContent:'center',
     borderTopLeftRadius: 8,
     borderBottomLeftRadius: 8
  },
  textInputImage: {
    width: 25,
    height: 25
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 25
  },
  networkErrorInfoContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginVertical: 10,
    borderRadius: 16,
    backgroundColor: colors.yellow
  },
  networkErrorInfoWrapper: {
    flex: 1
  },
  networkErrorInfoText: {
    fontSize: 13,
    color: colors.darkestGrey,
    textAlign: 'center',
    fontWeight: '600'
  }
});
