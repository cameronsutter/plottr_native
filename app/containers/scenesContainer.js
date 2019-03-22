import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { sceneActions } from 'pltr'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActionSheetIOS,
  AlertIOS,
  Alert,
  ScrollView,
  LayoutAnimation,
  Platform,
  Modal,
  Button,
} from 'react-native'
import SortableList from 'react-native-sortable-list'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AppStyles from '../styles'
import FakeNavHeader from '../components/fakeNavHeader'
import HeaderTitle from '../components/headerTitle'
import AddButton from '../components/addButton'
import MenuButton from '../components/menuButton'
import prompt from 'react-native-prompt-android'
import * as vars from '../styles/vars'

class ScenesContainer extends Component {
  static navigationOptions = ({ navigation }) => {
    let { params } = navigation.state
    params = params || {}
    return {
      drawerIcon: ({ tintColor, focused }) => (
        <Ionicons name={focused ? 'ios-film' : 'ios-film-outline'}
          size={28} style={{ color: tintColor }}
        />
      ),
      headerLeft: <MenuButton navigation={navigation} />,
      headerTitle: <HeaderTitle title='Scenes'/>,
      headerRight: <AddButton onPress={params.addScene ? params.addScene : () => null}/>,
    }
  }

  sortScenes = (scenes) => {
    const sortedScenes = _.sortBy(scenes, 'position')
    const data = sortedScenes.reduce((obj, scene, idx) => {
      obj[idx] = scene
      return obj
    }, {})
    return { data, sortedScenes }
  }

  setOrder = (sortedScenes) => {
    this.order = sortedScenes.map((l,idx) => idx)
  }

  constructor (props) {
    super(props)
    const sceneData = this.sortScenes(props.scenes)
    this.setOrder(sceneData.sortedScenes)
    this.state = {...sceneData, openModal: false, selectedScene: null}
  }

  componentWillReceiveProps (newProps) {
    const sceneData = this.sortScenes(newProps.scenes)
    this.setOrder(sceneData.sortedScenes)
    this.setState(sceneData)
  }

  componentDidMount () {
    this.props.navigation.setParams({addScene: this.addScene})
  }

  addScene = () => {
    LayoutAnimation.easeInEaseOut()
    this.props.actions.addScene()
  }

  rename = (scene) => {
    if (Platform.OS == 'ios') {
      AlertIOS.prompt(
        'New Scene Name:',
        `currently: ${scene.title || 'New Scene'}`,
        text => this.props.actions.editSceneTitle(scene.id, text)
      )
    } else {
      prompt(
        `Rename ${scene.title}` ,
        null,
        [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'OK', onPress: this.finishRename }
        ],
        {
          placeholder: this.props.storyName,
          defaultValue: scene.title,
        }
      )
    }
  }

  finishRename = (text) => {
    this.props.actions.editSceneTitle(this.state.selectedScene.id, text)
    this.setState({openModal: false})
  }

  delete = (scene) => {
    this.setState({openModal: false})
    Alert.alert(
      'Are you sure you want to delete',
      `${scene.title || 'New Scene'}?`,
      [
        {text: 'Yes', onPress: () => {
          this.props.actions.deleteScene(scene.id)
        }},
        {text: 'No', onPress: () => {}, style: 'cancel'},
      ]
    )
  }

  showActionSheet = (scene) => {
    if (Platform.OS == 'ios') {
      ActionSheetIOS.showActionSheetWithOptions({
          options: ['Rename', 'Delete', 'Cancel'],
          cancelButtonIndex: 2,
          destructiveButtonIndex: 1,
          title: 'Edit Scene',
          message: scene.title || 'New Scene',
        },
        (idx) => {
          switch (idx) {
            case 0:
              // rename
              this.rename(scene)
              break
            case 1:
              // delete
              this.delete(scene)
              break
            default:
              return
          }
        }
      )
    } else {
      this.setState({openModal: true, selectedScene: scene})
    }
  }

  saveOrder = (nextOrder) => {
    this.order = nextOrder
  }

  reorder = () => {
    const scenes = this.order.map((idx, position) => {
      var scene = this.state.sortedScenes[idx]
      scene.position = position
      return scene
    })
    LayoutAnimation.easeInEaseOut()
    this.props.actions.reorderScenes(scenes)
  }

  renderModal = () => {
    const scene = this.state.selectedScene
    if (!this.state.openModal) return null
    return <Modal
      animationType="slide"
      transparent={true}
      visible={this.state.openModal}
      onRequestClose={() => this.setState({ openModal: false })}
      >
        <View style={[styles.container, styles.buttonContainer]}>
          <View style={styles.buttonView}>
            <Button
              title={`Rename ${scene.title}`}
              color="#6cace4"
              onPress={() => this.rename(scene)}>
            </Button>
          </View>
          <View style={styles.buttonView}>
            <Button
              title="Delete"
              color="#6cace4"
              onPress={() => this.delete(scene)}>
            </Button>
          </View>
          <View style={styles.buttonView}>
            <Button
              title="Cancel"
              color="#6cace4"
              onPress={() => this.setState({ openModal: false })}>
            </Button>
          </View>
        </View>
    </Modal>
  }

  renderItem = ({data, active}) => {
    let itemStyles = [styles.listItem]
    if (active) itemStyles.push(styles.activeItem)
    return <View key={`scene-${data.id}`} style={itemStyles}>
      <TouchableOpacity onPress={() => this.showActionSheet(data)}>
        <View style={styles.touchableItem}>
          <Text style={styles.titleText}>{data.title || 'New Scene'}</Text>
        </View>
      </TouchableOpacity>
      <Ionicons name='ios-move' size={20} style={{ color: vars.black, paddingRight: 30 }} />
    </View>
  }

  render () {
    return <View style={styles.container}>
      { this.renderModal() }
      <SortableList
        data={this.state.data}
        renderRow={this.renderItem}
        onReleaseRow={this.reorder}
        onChangeOrder={this.saveOrder}
        style={styles.list}
      />
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    ...AppStyles.containerView,
    ...AppStyles.listBackground,
  },
  listItem: {
    ...AppStyles.listItem,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  touchableItem: AppStyles.touchableItem,
  descriptionText: AppStyles.descriptionText,
  titleText: AppStyles.titleText,
  list: {
    height: '100%',
  },
  activeItem: {
    transform: [{
      scale: 1.1,
    }],
    shadowRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: vars.black,
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOpacity: 1,
    shadowOffset: {height: 2, width: 2},
  },
  buttonContainer: {
    justifyContent: 'center',
    padding: '3%',
    backgroundColor: vars.white,
  },
  buttonView: {
    margin: '5%',
  },
})

ScenesContainer.propTypes = {
  navigation: PropTypes.object.isRequired,
  scenes: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  return {
    scenes: state.scenes,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(sceneActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScenesContainer)
