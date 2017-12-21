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
  TabBarIOS,
  NavigatorIOS,
  TouchableOpacity,
  NativeModules,
} from 'react-native';
import RootTabs from './app/navigators/rootTabs'
import Icon from 'react-native-vector-icons/FontAwesome'

const DocumentPicker = NativeModules.RNDocumentPicker

const store = configureStore({})

export class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      plusIcon: null,
      selectedTab: 'outline',
      data: null
    }
  }

  componentWillMount() {
    const data = this.fakeData()
    this.setState({ data })
    store.dispatch(uiActions.loadFile(data.file.fileName, false, data, data.file.version))
    Icon.getImageSource('plus', 25).then((source) => this.setState({ plusIcon: source }))
  }

  fakeData () {
    return FILE_DATA
  }

  openFile = () => {
    DocumentPicker.show({
      filetype: ['public.item'],
    }, async (error, url) => {
      console.log('url')
      console.log(url)
      const response = await fetch(url.uri)
      const data = await response.json()
      console.log(data)
      // alert(data)
      this.setState({ data })
      store.dispatch(uiActions.loadFile(data.file.fileName, false, data, data.file.version))
    })
  }

  renderNoFile () {
    return <View style={styles.container}>
      <Text>No file open!</Text>
      <TouchableOpacity onPress={this.openFile}>
        <View style={styles.button}><Text style={styles.buttonText}>Open a File</Text></View>
      </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#efefee',
  },
  tabContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    color: 'white',
  },
  button: {
    marginTop: 20,
    padding: 8,
    backgroundColor: '#ddd',
    borderRadius: 4,
  },
});

AppRegistry.registerComponent('plottr_native', () => App);


const FILE_DATA = {
  "characters": [
    {"id": 0, "name": "Leywa", "description": "description", "notes": "some notes here"},
    {"id": 1, "name": "Tahu", "description": "description", "notes": "some notes here"}
  ],
  "places": [
    {"id": 0, "name": "Holy Circle", "description": "a cool village", "notes": "some notes here"},
    {"id": 1, "name": "Pepperoni Ridge", "description": "an even cooler village", "notes": "some notes here"}
  ],
  "tags": [
    {"id": 0, "title": "Happy", "color": "orange"},
    {"id": 1, "title": "Earthy", "color": "green"}
  ],
  "cards": [
    {"id": 0, "title": "Beginning of the Story", "sceneId": 0, "lineId": 0, "description": "cool stuff"},
    {"id": 1, "title": "Middle of the story", "sceneId": 1, "lineId": 0, "description": "more cool stuff"},
    {"id": 2, "title": "Beginning of the subplot", "sceneId": 0, "lineId": 1, "description": "subplot stuff Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi quis ipsum felis. Maecenas vel leo magna. Maecenas nibh ligula, eleifend ut malesuada vitae, mollis non leo. Ut consequat neque nec magna rutrum mattis. Maecenas molestie congue bibendum. Integer et nunc vestibulum, maximus mauris congue, mattis elit. Aliquam eget libero tincidunt, lobortis elit eu, posuere enim. Etiam sed ultrices est, non dignissim nisl. Vivamus aliquet, risus ut sagittis accumsan, dolor elit pulvinar lorem, vitae laoreet diam mi ac tellus. Mauris id tincidunt libero. Vestibulum nec sodales ex, eget commodo neque.Etiam a dapibus arcu. Nullam malesuada erat eu leo viverra sagittis. Pellentesque laoreet dictum sagittis. Curabitur nec vestibulum quam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vitae viverra nisi, quis suscipit tortor. In at odio vestibulum, imperdiet lorem in, eleifend tortor. Suspendisse mollis tristique libero, eu bibendum lacus sagittis in. Curabitur at scelerisque mi. Cras eget accumsan sapien, vitae cursus massa. Nam at lorem lacinia, ullamcorper dolor sit amet, fermentum ipsum. Ut a scelerisque sem, vel semper neque. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce sit amet lectus ullamcorper ligula ornare vestibulum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris luctus lacus malesuada bibendum feugiat."}
  ],
  "scenes": [
    {"title": "beginning", "id": 0, "position": 0},
    {"title": "middle", "id": 1, "position": 1},
    {"title": "end", "id": 2, "position": 2}
  ],
  "lines": [{"id": 0, "title": "Main Plot", "color": "red"}, {"id": 1, "title": "Sub Plot", "color": "blue"}],
  "notes": [
    {"title": "a note", "id": 0, "content": "here is some content"},
    {"title": "another note", "id": 1, "content": "here is some content"}
  ],
  "customAttributes": {
    "characters": ['age', 'power', 'gender'],
    "places": ['weather', 'planet'],
    "cards": [],
    "scenes": [],
    "lines": []
  },
  "file": {},
  "storyName": "Pizza Planet 2",
  "ui": {"currentView": "timeline", "orientation": "horizontal"}
}
