import { ActionTypes } from 'pltr'
import { AsyncStorage } from 'react-native'

const { FILE_SAVED, FILE_LOADED, NEW_FILE } = ActionTypes
const BLACKLIST = [FILE_SAVED, FILE_LOADED]

const saver = store => next => action => {
  const result = next(action)
  if (BLACKLIST.includes(action.type)) return result
  // var isNewFile = action.type === NEW_FILE
  const state = store.getState()
  AsyncStorage.setItem('@Plottr:file', JSON.stringify(state))
  // TODO: save back to the file
  return result
}

export default saver
