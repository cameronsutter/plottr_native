import React, { Component } from 'react'
import { Provider } from 'react-redux'
import configureStore from './app/store/configureStore'
import { uiActions } from 'pltr'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  NativeModules,
  AsyncStorage,
} from 'react-native'
import RootTabs from './app/navigators/rootTabs'
import Icon from 'react-native-vector-icons/FontAwesome'
import * as vars from './app/styles/vars'
import Images from './images'

const DocumentPicker = NativeModules.RNDocumentPicker

const store = configureStore({})

export class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      plusIcon: null,
      data: null,
      fileName: null,
    }
  }

  async componentWillMount () {
    // await AsyncStorage.removeItem('@Plottr:file')
    // await AsyncStorage.removeItem('@Plottr:fileName')
    Icon.getImageSource('plus', 25).then((source) => this.setState({ plusIcon: source }))
    try {
      let strData = await AsyncStorage.getItem('@Plottr:file')
      let fileName = await AsyncStorage.getItem('@Plottr:fileName')
      if (strData !== null){
        let data = JSON.parse(strData)
        this.setState({ data, fileName })
        store.dispatch(uiActions.loadFile(fileName, false, data, data.file.version))
      }
    } catch (error) {
      console.log(error)
    }
  }

  openFile = async () => {
    DocumentPicker.show({
      filetype: ['public.item'],
    }, async (error, fileInfo) => {
      // console.log('fileINfo', fileInfo)
      if (fileInfo.fileName.includes('.pltr')) {
        // console.log('mime type', fileInfo.type)
        const response = await fetch(fileInfo.uri)
        const data = await response.json()
        this.setState({ data, fileName: fileInfo.uri })
        store.dispatch(uiActions.loadFile(fileInfo.uri, false, data, data.file.version))
        try {
          await AsyncStorage.setItem('@Plottr:file', JSON.stringify(data))
          await AsyncStorage.setItem('@Plottr:fileName', fileInfo.uri)
        } catch (error) {
          console.log(error)
        }
      } else {
        alert('Plottr cannot open that type of file')
      }
    })
  }

  createNewFile = async () => {
    let fileName = 'mobile.pltr'
    this.setState({data: {}, fileName})
    store.dispatch(uiActions.newFile('New Mobile Story'))
    try {
      await AsyncStorage.setItem('@Plottr:file', '{}')
      await AsyncStorage.setItem('@Plottr:fileName', fileName)
    } catch (error) {
      console.log(error)
    }
  }

  renderNoFile () {
    return <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to Plottr</Text>
      <Image source={Images.logo} style={styles.logo} />
      <View style={styles.row}>
        <TouchableOpacity onPress={this.openFile}>
          <View style={styles.button}><Text style={styles.buttonText}>Open</Text></View>
        </TouchableOpacity>
        <Text style={styles.orText}>Or</Text>
        <TouchableOpacity onPress={this.createNewFile}>
          <View style={styles.button}><Text style={styles.buttonText}>New</Text></View>
        </TouchableOpacity>
      </View>
    </View>
  }

  render() {
    if (this.state.data) {
      return <Provider store={store}>
        <RootTabs/>
      </Provider>
    } else {
      return this.renderNoFile()
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: vars.grayBackground,
    paddingTop: 50,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  logo: {
    height: '35%',
    resizeMode: 'contain',
    margin: 40,
  },
  button: {
    marginTop: 20,
    padding: 8,
    backgroundColor: vars.white,
    borderColor: vars.orange,
    borderWidth: 2,
    borderRadius: 4,
  },
  buttonText: {
    color: vars.orange,
    fontSize: 24,
  },
  orText: {
    fontSize: 26,
    margin: 20,
    marginTop: 40,
  }
})

AppRegistry.registerComponent('plottr_native', () => App)
