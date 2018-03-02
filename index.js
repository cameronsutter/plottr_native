import React, { Component } from 'react'
import { Provider } from 'react-redux'
import configureStore from './app/store/configureStore'
import { uiActions } from 'pltr'
import {
  AppRegistry,
  NativeModules,
  NativeEventEmitter,
} from 'react-native'
import { DrawerWrapper } from './app/navigators/drawers'
import { newFileData } from './helpers'
const { DocumentViewController, ReactNativeEventEmitter } = NativeModules
const emitter = new NativeEventEmitter(ReactNativeEventEmitter)

const NEW_FILE_DATA = newFileData()

const store = configureStore({})

const KEY_PREFIX = '@Plottr:' //for future reference

export class App extends Component {
  constructor (props) {
    super(props)
    let data = JSON.parse(props.data)
    store.dispatch(uiActions.loadFile(props.documentURL, false, data, data.file.version))
  }

  render() {
    return <Provider store={store}>
      <DrawerWrapper/>
    </Provider>
  }
}

AppRegistry.registerComponent('plottr_native', () => App)
