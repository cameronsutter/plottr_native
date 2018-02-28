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
  AlertIOS,
  NativeEventEmitter,
} from 'react-native'
import { DrawerWrapper } from './app/navigators/drawers'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AppStyles from './app/styles'
import * as vars from './app/styles/vars'
import Images from './images'
import hash from 'node-random-chars'
import { newFileData } from './helpers'
import FakeNavHeader from './app/components/fakeNavHeader'
import AddButton from './app/components/addButton'
const { DocumentViewController, ReactNativeEventEmitter } = NativeModules
const emitter = new NativeEventEmitter(ReactNativeEventEmitter)

console.log('DocumentViewController', DocumentViewController)

// const DocumentPicker = NativeModules.RNDocumentPicker

const NEW_FILE_DATA = newFileData()

const store = configureStore({})

const KEY_PREFIX = '@Plottr:'

export class App extends Component {
  state = {
    fileList: null,
    fileChosen: false,
    showFileList: false,
  }

  constructor (props) {
    super(props)
    console.log(props)
    let data = JSON.parse(props.data)
    store.dispatch(uiActions.loadFile(props.documentURL, false, data, data.file.version))
    this.state = {
      fileChosen: true,
      fileURL: props.documentURL
    }
  }

  componentWillMount () {
    // await AsyncStorage.setItem(`${KEY_PREFIX}fileList`, '[]')
    this.fetchList()
  }

  fetchList = async () => {
    let fileListStr = await AsyncStorage.getItem(`${KEY_PREFIX}fileList`)
    if (fileListStr !== null){
      let fileList = JSON.parse(fileListStr)
      this.setState({ fileList })
    } else {
      let list = []
      this.setState({ fileList: list })
      await AsyncStorage.setItem(`${KEY_PREFIX}fileList`, JSON.stringify(list))
    }
  }

  componentDidMount () {
    setTimeout(() => {
      this.setState({showFileList: true})
    }, 700)
  }

  addFileToList = async (newItem) => {
    let newFileList = [
      ...this.state.fileList,
      newItem,
    ]
    this.setState({ fileList: newFileList })
    await AsyncStorage.setItem(`${KEY_PREFIX}fileList`, JSON.stringify(newFileList))
    await AsyncStorage.setItem(`${KEY_PREFIX}currentIndex`, (newFileList.length - 1).toString())
  }

  chooseFile = async () => {
    // DocumentPicker.show({
    //   filetype: ['public.item'],
    // }, async (error, fileInfo) => {
    //   // console.log('fileINfo', fileInfo)
    //   if (fileInfo.fileName.includes('.pltr')) {
    //     // console.log('mime type', fileInfo.type)
    //     const response = await fetch(fileInfo.uri)
    //     const data = await response.json()
    //     this.setState({ fileChosen: true })
    //     store.dispatch(uiActions.loadFile(fileInfo.uri, false, data, data.file.version))
    //     let name = fileInfo.uri.substring(fileInfo.uri.lastIndexOf('/') + 1, fileInfo.uri.lastIndexOf('.pltr'))
    //     let current = {onDevice: false, path: fileInfo.uri, name, data}
    //     this.addFileToList(current)
    //   } else {
    //     alert('Plottr cannot open that type of file')
    //   }
    // })
  }

  createNewFile = async () => {
    this.setState({ fileChosen: true })
    store.dispatch(uiActions.newFile(NEW_FILE_DATA.storyName))
    let current = {onDevice: true, path: '', name: NEW_FILE_DATA.storyName, data: NEW_FILE_DATA}
    this.addFileToList(current)
  }

  openFile = async (item, index) => {
    this.setState({ fileChosen: true })
    store.dispatch(uiActions.loadFile(item.path, false, item.data, item.data.file.version))
    await AsyncStorage.setItem(`${KEY_PREFIX}currentIndex`, index.toString())
  }

  askToRemoveFile = (index) => {
    AlertIOS.alert(
      'Delete File',
      'Are you sure? This can\'t be undone',
      [{
          text: 'Delete',
          onPress: () => this.deleteFile(index),
        }, {
          text: 'Cancel',
        },
      ],
    )
  }

  deleteFile = async (index) => {
    let newList = [...this.state.fileList]
    let deleted = newList.splice(index, 1)
    this.setState({ fileList: newList })
    await AsyncStorage.setItem(`${KEY_PREFIX}fileList`, JSON.stringify(newList))
    let deletedListStr = await AsyncStorage.getItem(`${KEY_PREFIX}deletedItems`)
    let deletedList = []
    if (deletedListStr !== null) {
      deletedList = JSON.parse(deletedListStr)
    }
    deletedList.push(deleted)
    AsyncStorage.setItem(`${KEY_PREFIX}deletedItems`, JSON.stringify(deletedList))
  }

  closeFile = () => {
    this.fetchList()
    this.setState({ fileChosen: false })
    // MAYBE: unset AsyncStorage currentIndex
  }

  changeName = (index) => {
    let list = [...this.state.fileList]
    let current = list[index]
    AlertIOS.prompt('Change Story Name', null, (newName) => {
      current.name = newName
      current.data.storyName = newName
      list[index] = current
      this.setState({fileList: list})
      AsyncStorage.setItem(`${KEY_PREFIX}fileList`, JSON.stringify(list))
    })
  }

  renderFile = ({ item, index }) => {
    return <View style={[styles.fileListItem, styles.listItem]}>
      <View style={[styles.row, styles.nameRow]}>
        <TouchableOpacity onPress={() => this.changeName(index)}>
          <View style={{paddingRight: 15}}>
            <Ionicons name='md-create' size={30} style={{ color: vars.blue }} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.openFile(item, index)}>
          <Text style={styles.fileNameText}>{item.name.substring(0, 20)}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => this.askToRemoveFile(index)}>
        <View><Ionicons name='ios-remove-circle' size={30} style={{ color: vars.red }} /></View>
      </TouchableOpacity>
    </View>
  }

  renderFileList = () => {
    if (!this.state.fileList) return <ActivityIndicator/>
    return <FlatList
      style={styles.filesList}
      data={this.state.fileList}
      renderItem={this.renderFile}
      keyExtractor={() => `file-${hash.create(6)}`}
    />
  }

  renderNoFile () {
    if (this.state.showFileList) {
      let fileList = this.renderFileList()
      let importButton = <TouchableOpacity onPress={this.chooseFile}>
        <View style={styles.button}><Ionicons name='ios-cloud-download-outline' size={34} style={{color: vars.orange}}/></View>
      </TouchableOpacity>
      return <View style={styles.container}>
        <FakeNavHeader
          title='Files'
          leftButton={importButton}
          rightButton={<AddButton onPress={this.createNewFile}/>}
        />
        {fileList}
      </View>
      // return <View style={styles.container}>
      //   <Text style={styles.yourFilesText}>Files</Text>
      //   <View style={styles.filesContainer}>
      //     <View style={styles.row}>
      //       <TouchableOpacity onPress={this.createNewFile}>
      //         <View style={styles.button}><Text style={styles.buttonText}>New</Text></View>
      //       </TouchableOpacity>
      //       <TouchableOpacity onPress={this.chooseFile}>
      //         <View style={styles.button}><Text style={styles.buttonText}>Import...</Text></View>
      //       </TouchableOpacity>
      //     </View>
      //     <View style={styles.divider} />
      //     { fileList }
      //   </View>
      // </View>
    } else {
      return <View style={styles.logoContainer}>
        <Text style={styles.welcomeText}>Welcome to Plottr</Text>
        <Image source={Images.logo} style={styles.logo} />
      </View>
    }
  }

  render() {
    // screenProps={{close: DocumentViewController.closeDocument}}
    if (this.state.fileChosen) {
      return <Provider store={store}>
        <DrawerWrapper/>
      </Provider>
    } else {
      return this.renderNoFile()
    }
  }
}

// <DrawerWrapper screenProps={{close: DocumentViewController.closeDocument}}/>

const styles = StyleSheet.create({
  container: {
    ...AppStyles.containerView,
    ...AppStyles.listBackground,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: vars.grayBackground,
    paddingTop: 50,
  },
  listItem: AppStyles.listItem,
  touchableItem: AppStyles.touchableItem,
  descriptionText: AppStyles.descriptionText,
  titleText: AppStyles.titleText,
  filesContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'stretch',
    width: '100%',
    padding: 25,
  },
  fileListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  },
  filesList: {
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: vars.black,
    height: 1,
    marginVertical: 10,
  },
  nameRow: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
})

AppRegistry.registerComponent('plottr_native', () => App)
