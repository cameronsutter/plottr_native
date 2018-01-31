import * as vars from './vars'
import { StyleSheet } from 'react-native'

export default FakeNavStyles = {
  header: {
    backgroundColor: vars.grayBackground,
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    height: 60,
    borderBottomColor: vars.black,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerBackground: {
    backgroundColor: vars.grayBackground,
  },
  containerBackground: {
    backgroundColor: '#e4e3eb',
  },
}
