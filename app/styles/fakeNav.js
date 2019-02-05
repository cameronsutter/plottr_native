import * as vars from './vars'
import { StyleSheet, Platform } from 'react-native'

export default FakeNavStyles = {
  header: {
    backgroundColor: vars.grayBackground,
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: vars.black,
    borderBottomWidth: StyleSheet.hairlineWidth,
    ...Platform.select({
      ios: {
        height: 60,
        marginTop: 20,
      },
      android: {
        height: 60,
        marginTop: 5,
      }
    })
  },
  headerBackground: {
    backgroundColor: vars.grayBackground,
  },
  containerBackground: {
    backgroundColor: '#e4e3eb',
  },
}
