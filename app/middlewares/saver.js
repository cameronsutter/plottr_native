import { ActionTypes } from 'pltr'
import { AsyncStorage, Platform, NativeModules } from 'react-native'
const { DocumentViewController, Document } = NativeModules

const KEY_PREFIX = '@Plottr:'
const { FILE_SAVED, FILE_LOADED, NEW_FILE, EDIT_CARD_DETAILS } = ActionTypes
const BLACKLIST = [FILE_SAVED, FILE_LOADED, EDIT_CARD_DETAILS] // card details because it edits details and then coordinates and 2 like that screw up iOS

const saver = store => next => action => {
  const result = next(action)
  if (BLACKLIST.includes(action.type)) return result
  // var isNewFile = action.type === NEW_FILE
  const state = store.getState()
  const stringState = JSON.stringify(state, null, 2)
  if (Platform.OS === 'ios') {
    DocumentViewController.updateDocument(stringState)
  } else if (Platform.OS === 'android') {
    Document.saveDocument(stringState)
  }
  return result
}

export default saver
