import { ActionTypes } from 'pltr'
import { AsyncStorage } from 'react-native'

const KEY_PREFIX = '@Plottr:'
const { FILE_SAVED, FILE_LOADED, NEW_FILE } = ActionTypes
const BLACKLIST = [FILE_SAVED, FILE_LOADED]


async function saveToAsync (state) {
  let currentIndexStr = await AsyncStorage.getItem(`${KEY_PREFIX}currentIndex`)
  let currentIndex = parseInt(currentIndexStr)
  let fileListStr = await AsyncStorage.getItem(`${KEY_PREFIX}fileList`)
  let fileList = JSON.parse(fileListStr)
  let current = {
    ...fileList[currentIndex],
    data: state,
  }
  fileList[currentIndex] = current
  await AsyncStorage.setItem(`${KEY_PREFIX}fileList`, JSON.stringify(fileList))
}

const saver = store => next => action => {
  const result = next(action)
  if (BLACKLIST.includes(action.type)) return result
  // var isNewFile = action.type === NEW_FILE
  const state = store.getState()
  saveToAsync(state)
  // TODO: save back to the file
  return result
}

export default saver
