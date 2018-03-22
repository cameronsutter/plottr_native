import { ActionTypes } from 'pltr'
import Mixpanel from 'react-native-mixpanel'

const { ADD_CHARACTER, ADD_TAG, ADD_PLACE, ADD_CARD, ADD_LINE, ADD_SCENE, ADD_NOTE } = ActionTypes
const WHITELIST = [ADD_CHARACTER, ADD_TAG, ADD_PLACE, ADD_CARD, ADD_LINE, ADD_SCENE, ADD_NOTE]

const tracker = store => next => action => {
  if (WHITELIST.includes(action.type)) {
    Mixpanel.track(action.type.toLowerCase())
  }
  return next(action)
}

export default tracker
