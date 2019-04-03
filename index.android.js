import React, { Component } from 'react'
import { Provider } from 'react-redux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Icon from 'react-native-vector-icons/FontAwesome'
import configureStore from './app/store/configureStore'
import { uiActions } from 'pltr'
import {
  AppRegistry,
  NativeModules,
  UIManager,
} from 'react-native'
import { DrawerWrapper } from './app/navigators/drawers'
import { newFileData } from './helpers'
import Mixpanel from 'react-native-mixpanel'
Mixpanel.sharedInstanceWithToken('f1b3d3cc4788a907468cdde7d2bd7340')
Ionicons.loadFont()
Icon.loadFont()

UIManager.setLayoutAnimationEnabledExperimental(true)

const NEW_FILE_DATA = newFileData()

const store = configureStore({})

export class App extends Component {
  constructor (props) {
    super(props)

    NativeModules.Document.setDocumentData(props.documentURL, props.data)

    let data = JSON.parse(props.data)
    if (data.newFile) {
      let storyName = data.storyName || props.storyName
      if (storyName.includes('.pltr')) storyName = storyName.replace('.pltr', '')
      data = NEW_FILE_DATA
      data.storyName = storyName
    }

    store.dispatch(uiActions.loadFile(props.documentURL, false, data, data.file.version))
    Mixpanel.trackWithProperties('open_file', {new_file: data.newFile})
  }

  render() {
    return <Provider store={store}>
      <DrawerWrapper/>
    </Provider>
  }
}

AppRegistry.registerComponent('plottr_native', () => App)
