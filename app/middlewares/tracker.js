import RNMixpanel from 'react-native-mixpanel'
import { NativeModules } from 'react-native'
import { ActionTypes } from 'pltr'
var mixpanel = NativeModules.RNMixpanel

console.log(NativeModules)
console.log(mixpanel)

mixpanel.sharedInstanceWithToken('f1b3d3cc4788a907468cdde7d2bd7340')

class MixpanelTracker {
  track (event, attrs = {}) {
    let baseAttrs = {
      platform: process.platform,
    }
    let attributes = Object.assign(baseAttrs, attrs)
    mixpanel.trackWithProperties(event, attributes)
  }
}

export const MPT = new MixpanelTracker()

const { ADD_CHARACTER, ADD_TAG, ADD_PLACE, ADD_CARD, ADD_LINE, ADD_SCENE, FILE_SAVED } = ActionTypes
const WHITELIST = [ADD_CHARACTER, ADD_TAG, ADD_PLACE, ADD_CARD, ADD_LINE, ADD_SCENE, FILE_SAVED]
console.log('platform', process.platform)

export const tracker = store => next => action => {
  if (WHITELIST.includes(action.type)) { MPT.track(action.type) }
  return next(action)
}
