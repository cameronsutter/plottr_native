import * as vars from './vars'
import { Platform } from 'react-native'

export default DrawerStyles = {
  buttonWrapper: {
    flexDirection: 'row',
    marginLeft: 20,
    alignItems: 'center',
    width: '80%',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    ...Platform.select({
      android: {
        color: vars.black,
      }
    })
  },
  buttonIcon: {
    color: vars.orange,
    marginRight: 35,
  },
}
