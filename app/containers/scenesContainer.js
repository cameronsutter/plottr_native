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
} from 'react-native'
import SortableList from 'react-native-sortable-list'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AppStyles from '../styles'
import FakeNavHeader from '../components/fakeNavHeader'
import HeaderTitle from '../components/headerTitle'
import AddButton from '../components/addButton'
import MenuButton from '../components/menuButton'
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
    this.state = sceneData
  }

  componentWillReceiveProps (newProps) {
    const sceneData = this.sortScenes(newProps.scenes)
    this.setOrder(sceneData.sortedScenes)
    this.setState(sceneData)
  }

  addScene = () => {
    this.props.actions.addScene()
  }

  showActionSheet = (scene) => {
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
            AlertIOS.prompt(
              'New Scene Name:',
              `currently: ${scene.title || 'New Scene'}`,
              text => this.props.actions.editSceneTitle(scene.id, text)
            )
            break
          case 1:
            // delete
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
            break
          default:
            return
        }
      }
    )
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
    this.props.actions.reorderScenes(scenes)
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
      <Ionicons name='ios-move' size={20} style={{ color: vars.black, paddingRight: 20 }} />
    </View>
  }

  render () {
    return <View style={styles.container}>
      <FakeNavHeader
        title='Scenes'
        leftButton={<MenuButton navigation={this.props.navigation}/>}
        rightButton={<AddButton onPress={this.addScene}/>}
      />
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
    backgroundColor: vars.grayBackground,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: vars.black,
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
