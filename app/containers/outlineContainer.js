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
  FlatList,
  TouchableOpacity,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AppStyles from '../styles'
import HeaderTitle from '../components/headerTitle'
import AddButton from '../components/addButton'

class OutlineContainer extends Component {
  static navigationOptions = ({ navigation }) => {
    let { params } = navigation.state
    params = params || {}
    return {
      headerTitle: <HeaderTitle title='Outline'/>,
      headerRight: <AddButton onPress={params.addScene ? params.addScene : () => null}/>,
    }
  }

  addScene = () => {
    this.props.navigation.navigate('AddScene', {newScene: true})
  }

  componentDidMount () {
    this.props.navigation.setParams({addScene: this.addScene})
  }

  cardMapping = () => {
    return this.props.scenes.reduce((obj, scene) => {
      obj[scene.id] = this.sortedSceneCards(scene.id)
      return obj
    }, {})
  }

  sortedSceneCards = (sceneId) => {
    var cards = this.findSceneCards(sceneId)
    const lines = _.sortBy(this.props.lines, 'position')
    var sorted = []
    lines.forEach((l) => {
      var card = _.find(cards, {lineId: l.id})
      if (card) {
        sorted.push(card)
      }
    })
    return sorted
  }

  findSceneCards = (sceneId) => {
    return this.props.cards.filter(c => c.sceneId === sceneId)
  }

  renderItem = (scene, cardMap) => {
    let cardIds = cardMap[scene.id].map(c => c.id)
    return <View key={`scene-${scene.id}`} style={styles.listItem}>
      <TouchableOpacity onPress={() => this.props.navigation.navigate('Scene', {scene, cardIds})}>
        <View style={styles.touchableItem}>
          <Text style={styles.touchableItemText}>{scene.title}</Text>
          <Icon name={'angle-right'} size={25}></Icon>
        </View>
      </TouchableOpacity>
    </View>
  }

  render () {
    let cardMap = this.cardMapping()
    let scenes = _.orderBy(this.props.scenes, 'position')
    return <View style={styles.container}>
      <FlatList
        data={scenes}
        keyExtractor={(scene) => scene.id}
        renderItem={({item}) => this.renderItem(item, cardMap)}
      />
    </View>
  }
}

const styles = StyleSheet.create({
  container: AppStyles.containerView,
  listItem: AppStyles.listItem,
  touchableItem: AppStyles.touchableItem,
  touchableItemText: {
    fontSize: 16,
    color: 'black',
  }
})

OutlineContainer.propTypes = {
  navigation: PropTypes.object.isRequired,
  cards: PropTypes.array.isRequired,
  lines: PropTypes.array.isRequired,
  scenes: PropTypes.array.isRequired,
}

function mapStateToProps (state) {
  return {
    cards: state.cards,
    lines: state.lines,
    scenes: state.scenes
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
)(OutlineContainer)
