import * as vars from './vars'
import { StyleSheet } from 'react-native'

export default CAstyles = {
  inputWrapper: {
    marginBottom: 10,
  },
  input: {
    width: '100%',
    fontSize: 24,
    backgroundColor: vars.white,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 10,
  },
  instructionsWrapper: {
    padding: 10,
    alignSelf: 'stretch',
    marginBottom: 5,
  },
  instructionsText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}
