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
  Alert,
} from 'react-native'
const { Document } = NativeModules
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

    // console.log('URI', props.storyName)

    if (props.storyName.includes('.pltr')) {
      let data = {}
      try {
        data = JSON.parse(props.data)
        Document.setDocumentData(props.documentURL, props.data)
      } catch (e) {
        // alert because possibly wrong file type
        this.alertWrongFileType()
        // Alert.alert('LOG', 'Parsing')
      }
      if (data.newFile) {
        let storyName = data.storyName || props.storyName
        if (storyName.includes('.pltr')) storyName = storyName.replace('.pltr', '')
        data = NEW_FILE_DATA
        data.storyName = storyName
      }

      if (data.file) {
        store.dispatch(uiActions.loadFile(props.documentURL, false, data, data.file.version))
        Mixpanel.trackWithProperties('open_file', {new_file: data.newFile})
      } else {
        // Alert.alert('LOG', `Checking for file.version ${data.file}`)
        this.alertWrongFileType()
      }
    } else {
      this.alertWrongFileType()
      // Alert.alert('LOG', 'Checking for .pltr')
    }

  }

  alertWrongFileType = () => {
    Alert.alert(
      'Wrong file type',
      'You tried to open a non-Plottr file',
      [
        {text: 'OK', onPress: () => Document.closeDocument()}
      ],
      { onDismiss: () => Document.closeDocument() }
    )
  }

  render() {
    return <Provider store={store}>
      <DrawerWrapper/>
    </Provider>
  }
}

AppRegistry.registerComponent('plottr_native', () => App)
