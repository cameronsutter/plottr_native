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
  FlatList,
  ActivityIndicator,
} from 'react-native'
import RootTabs from './app/navigators/rootTabs'
import Icon from 'react-native-vector-icons/FontAwesome'
import * as vars from './app/styles/vars'
import Images from './images'

const DocumentPicker = NativeModules.RNDocumentPicker

const store = configureStore({})

const KEY_PREFIX = '@Plottr:'

export class App extends Component {
  state = {
    fileList: null,
    fileChosen: false,
    showFileList: false,
  }

  async componentWillMount () {
    // await AsyncStorage.setItem(`${KEY_PREFIX}fileList`, '[]')
    // Icon.getImageSource('plus', 25).then((source) => this.setState({ plusIcon: source }))
    try {
      // let strData = await AsyncStorage.getItem('@Plottr:file')
      // let fileName = await AsyncStorage.getItem('@Plottr:fileName')
      let fileListStr = await AsyncStorage.getItem(`${KEY_PREFIX}fileList`)
      if (fileListStr !== null){
        let fileList = JSON.parse(fileListStr)
        this.setState({ fileList })
        // store.dispatch(uiActions.loadFile(fileName, false, data, data.file.version))
      } else {
        this.setState({ fileList: [] })
        await AsyncStorage.setItem(`${KEY_PREFIX}fileList`, '[]')
      }
    } catch (error) {
      console.log(error)
    }
  }

  componentDidMount () {
    setTimeout(() => {
      this.setState({showFileList: true})
    }, 700)
  }

  addFileToList = async ({onDevice, path, name, data}) => {
    let newFileList = [
      ...this.state.fileList,
      {onDevice, path, name, data},
    ]
    this.setState({ fileList: newFileList })
    try {
      await AsyncStorage.setItem(`${KEY_PREFIX}fileList`, JSON.stringify(newFileList))
    } catch (error) {
      console.log(error)
    }
  }

  chooseFile = async () => {
    DocumentPicker.show({
      filetype: ['public.item'],
    }, async (error, fileInfo) => {
      // console.log('fileINfo', fileInfo)
      if (fileInfo.fileName.includes('.pltr')) {
        // console.log('mime type', fileInfo.type)
        const response = await fetch(fileInfo.uri)
        const data = await response.json()
        this.setState({ fileChosen: true })
        store.dispatch(uiActions.loadFile(fileInfo.uri, false, data, data.file.version))
        let name = fileInfo.uri.substring(fileInfo.uri.lastIndexOf('/') + 1, fileInfo.uri.lastIndexOf('.pltr'))
        let current = {onDevice: false, path: fileInfo.uri, name, data: JSON.stringify(data)}
        this.addFileToList(current)
        await AsyncStorage.setItem(`${KEY_PREFIX}currentIndex`, (this.state.fileList.length - 1).toString())
      } else {
        alert('Plottr cannot open that type of file')
      }
    })
  }

  createNewFile = async () => {
    let fileName = 'New Mobile Story'
    this.setState({ fileChosen: true })
    store.dispatch(uiActions.newFile(fileName))
    let current = {onDevice: true, path: '', name: fileName, data: '{}'}
    this.addFileToList(current)
    await AsyncStorage.setItem(`${KEY_PREFIX}currentIndex`, (this.state.fileList.length - 1).toString())
  }

  openFile = async (item, index) => {
    this.setState({ fileChosen: true })
    let data = JSON.parse(item.data)
    store.dispatch(uiActions.loadFile(item.path, false, data, data.file.version))
    await AsyncStorage.setItem(`${KEY_PREFIX}currentIndex`, index.toString())
  }

  closeFile = () => {
    this.setState({ fileChosen: false })
    // MAYBE: unset AsyncStorage currentIndex
  }

  renderFile = ({ item, index }) => {
    return <TouchableOpacity onPress={() => this.openFile(item, index)}>
      <Text style={styles.fileNameText}>{item.name}</Text>
    </TouchableOpacity>
  }

  renderFileList = () => {
    if (!this.state.fileList) return <ActivityIndicator/>
    return <FlatList
      style={styles.filesList}
      data={this.state.fileList}
      renderItem={this.renderFile}
      keyExtractor={({index}) => `file-${index}`}
    />
  }

  renderNoFile () {
    if (this.state.showFileList) {
      let fileList = this.renderFileList()
      return <View style={styles.container}>
        <Text style={styles.yourFilesText}>Your files</Text>
        <View style={styles.row}>
          <TouchableOpacity onPress={this.chooseFile}>
            <View style={styles.button}><Text style={styles.buttonText}>Import...</Text></View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.createNewFile}>
            <View style={styles.button}><Text style={styles.buttonText}>New</Text></View>
          </TouchableOpacity>
          <View style={styles.divider} />
          { fileList }
        </View>
      </View>
    } else {
      return <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome to Plottr</Text>
        <Image source={Images.logo} style={styles.logo} />
      </View>
    }
  }

  render() {
    if (this.state.fileChosen) {
      return <Provider store={store}>
        <RootTabs screenProps={{close: this.closeFile}}/>
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
    justifyContent: 'space-around',
    alignItems: 'stretch',
    width: '100%',
    padding: 25,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  yourFilesText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  logo: {
    height: '35%',
    resizeMode: 'contain',
    margin: 40,
  },
  button: {
    margin: 5,
    padding: 5,
  },
  buttonText: {
    color: vars.orange,
    fontSize: 24,
  },
  fileNameText: {
    color: vars.orange,
    fontSize: 22,
    padding: 10,
  },
  filesList: {
  },
  divider: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: vars.black,
    height: 1,
    marginVertical: 10,
  },
})

AppRegistry.registerComponent('plottr_native', () => App)
