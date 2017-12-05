import {colors} from '../../themes/';

export default {
  backgroundImageWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  backgroundImage: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'stretch'
  },
  mainContent: {
    flex: 1
  },
  profileImageContainer: {
    paddingTop: 60,
    paddingBottom: 10
  },
  profileImage: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40
  },
  profileName: {
    alignSelf: 'center',
    color: colors.white,
    marginTop: 15,
    fontSize: 16
  },
  buttonsContainer: {
    flex: 1
  },
  mainButtonsContainer: {
    paddingVertical: 30,
    paddingTop: 130,
    opacity: 0.85,
    flex: 1
  },
  logoutButtonContainer: {
    opacity: 0.85
  },
  versionNumberContainer: {
    height: 80,
    paddingVertical: 20,
    alignItems: 'center',
  },
  versionNumber: {
    fontSize: 13,
    opacity: 0.8,
    color: colors.white
  },
  sidebarLogoContainer: {
    paddingVertical: 30,
    opacity: 0.8,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidebarLogoText: {
    fontSize: 11,
    color: colors.white,
    fontStyle: 'italic',
    fontWeight: '300',
  },
  sidebarLogoTextBold: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.white,
    fontStyle: 'italic',
    marginLeft: 5
  },
  scrollView: {
    alignItems: 'center'
  }
}
