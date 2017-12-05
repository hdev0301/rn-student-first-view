import {StyleSheet} from 'react-native';
import {colors, metrics, applicationStyles} from '../../themes/';

export default StyleSheet.create({
  ...applicationStyles.screen,
  scrollView: {
    backgroundColor: colors.lightGrey,
    height: metrics.screenHeight - metrics.statusBarHeight - metrics.mainToolbarHeight
  },
  profileImageContainer: {
    paddingVertical: 30,
    backgroundColor: colors.greyBlue
  },
  profileImage: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40
  },
  profileContainer: {
    flexDirection: 'column'
  },
  profileHeaderContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: colors.lightGrey
  },
  profileHeaderText: {
    fontWeight: '500',
    color: colors.darkerGrey
  },
  studentsContainer: {
    flexDirection: 'column'
  },
  studentsHeaderContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: colors.lightGrey
  },
  studentsHeaderText: {
    fontWeight: '500',
    color: colors.darkerGrey
  },
  logoutButtonContainer: {
    height: 60,
    marginVertical: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderColor: colors.grey
  },
  logoutButtonText: {
    color: colors.darkGrey,
    fontWeight: '600'
  }
})
