import ActionTypes, { FILE_SAVED } from 'pltr'
import { AsyncStorage } from 'react-native'
// import RNFS from 'react-native-fs'

const saver = store => next => action => {
  const result = next(action)
  if (action.type === FILE_SAVED) return result
  // var isNewFile = action.type === NEW_FILE
  const state = store.getState()
  AsyncStorage.setItem('@Plottr:file', JSON.stringify(state))
  // save back to the file
  // RNFS.writeFile(state.file.fileName, state)
  return result
}

export default saver
