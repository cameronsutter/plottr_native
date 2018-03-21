import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { sceneActions } from 'pltr'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import AppStyles from '../styles'
import * as vars from '../styles/vars'
import HeaderTitle from './headerTitle'
import AddButton from './addButton'

class SceneView extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state
    return {
      headerTitle: <HeaderTitle title={params.scene.title} />
    }
  }

  componentWillMount () {
    this.props.navigation.setParams({addCard: this.addCard})
  }

  sortCards = () => {
    const { scene } = this.props.navigation.state.params
    let realCards = []
    let emptyCards = []
    let sortedLines = _.sortBy(this.props.lines, 'position')
    sortedLines.forEach(l => {
      var card = _.find(this.props.cardsInScene, {lineId: l.id})
      if (card) {
        realCards.push(card)
      } else {
        emptyCards.push({newCard: true, sceneId: scene.id, lineId: l.id, title: 'Add', description: ''})
      }
    })
    return [...realCards, ...emptyCards]
  }

  renderItem = ({ item, index }) => {
    const card = item
    let line = _.find(this.props.lines, {id: card.lineId})
    let cardStyles = [{borderColor: line.color}]
    let titleStyles = []
    let lineStyles = [{color: line.color}]
    let description = <Text style={styles.descriptionText}>
      {card.description && card.description.substring(0, 100)}
    </Text>
    let icon = <Icon name={'angle-right'} size={25}></Icon>
    if (card.newCard) {
      cardStyles.push(styles.newCard)
      titleStyles.push(styles.newCardTitle)
      lineStyles.push(styles.newCardLineText)
      description = null
      icon = null
    }
    return <View style={styles.listItem}>
      <TouchableOpacity onPress={() => this.props.navigation.navigate('Card', { card })}>
        <View style={[styles.touchableItem, ...cardStyles]}>
          <View>
            <Text style={[styles.cardTitleText, ...titleStyles]}>{card.title}</Text>
            <Text style={[styles.lineTitleText, ...lineStyles]}>{line.title || 'New Plotline'}</Text>
            { description }
          </View>
          { icon }
        </View>
      </TouchableOpacity>
    </View>
  }

  render () {
    let body = <View style={styles.noCardsContainer}>
      <Text style={styles.noCardsText}>No Cards in this Scene</Text>
    </View>
    if (this.props.cardsInScene.length > 0) {
      let sortedCards = this.sortCards()
      body = <FlatList
        style={styles.list}
        data={sortedCards}
        keyExtractor={(card, index) => card.id !== undefined ? `card-${card.id}` : `card-new-card-${index}`}
        renderItem={this.renderItem}
      />
    }
    return <View style={styles.container}>
      { body }
    </View>
  }
}

const styles = StyleSheet.create({
  container: AppStyles.containerView,
  descriptionText: AppStyles.descriptionText,
  list: {
  },
  listItem: {
  },
  touchableItem: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: vars.white,
    borderRadius: 4,
    borderWidth: 1,
  },
  cardTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  lineTitleText: {
    fontSize: 12,
    marginTop: 10,
    marginBottom: 10,
  },
  noCardsContainer: {
    alignSelf: 'center',
    marginTop: 150,
  },
  noCardsText: {
    fontSize: 24,
  },
  newCard: {
    borderStyle: 'dashed',
    backgroundColor: '#e4e3eb',
    justifyContent: 'center',
  },
  newCardTitle: {
    color: vars.grayText,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'normal',
  },
  newCardLineText: {
    marginTop: 5,
    marginBottom: 2,
  },
})

SceneView.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    state: PropTypes.shape({
      params: PropTypes.shape({
        scene: PropTypes.object.isRequired,
      })
    }).isRequired,
  }).isRequired,
  cardsInScene: PropTypes.array,
  scenes: PropTypes.array.isRequired,
  lines: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}

function mapStateToProps (state, ownProps) {
  const { scene } = ownProps.navigation.state.params
  let cardsInScene = state.cards.filter(c => {
    return scene.id === c.sceneId
  })
  return {
    cardsInScene,
    lines: state.lines,
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
)(SceneView)
