import {StyleSheet} from 'react-native';
import {colors, applicationStyles, metrics} from '../../themes';

export default StyleSheet.create({
  ...applicationStyles.screen,
  listContainer: {
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'stretch',
    height: 310
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderBottomWidth: 4,
    borderColor: colors.grey
  },
  noStudentsOrServicesText: {
    textAlign: 'center',
    color: colors.darkerGrey,
    marginHorizontal: 10,
    marginVertical: 20,
    fontSize: 20,
    lineHeight: 30
  },
  noStudentsOrServicesContainer: {
    flex: 1
  },
  noStudentsOrServicesTextContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    marginHorizontal: 25,
    marginTop: 25
  }
})
