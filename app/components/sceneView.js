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
      headerTitle: <HeaderTitle title={params.scene.title} />,
      headerRight: <AddButton onPress={params.addCard ? params.addCard : () => null}/>
    }
  }

  componentWillReceiveProps () {
    // try getting it to re-render here when the cards have been edited in cardDetails
  }

  componentWillMount () {
    this.props.navigation.setParams({addCard: this.addCard})
  }

  addCard = () => {
    const { scene } = this.props.navigation.state.params
    this.props.navigation.navigate('Card', {sceneId: scene.id, newCard: true})
  }

  renderItem = (card) => {
    let line = _.find(this.props.lines, {id: card.lineId})
    let color = {color: line.color}
    let borderColor = {borderColor: line.color}
    return <View key={`card-${card.id}`} style={styles.listItem}>
      <TouchableOpacity onPress={() => this.props.navigation.navigate('Card', { card })}>
        <View style={[styles.touchableItem, borderColor]}>
          <View>
            <Text style={styles.cardTitleText}>{card.title}</Text>
            <Text style={[styles.lineTitleText, color]}>{line.title}</Text>
            <Text style={styles.descriptionText}>{card.description.substring(0, 100)}</Text>
          </View>
          <Icon name={'angle-right'} size={25}></Icon>
        </View>
      </TouchableOpacity>
    </View>
  }

  render () {
    let body = <View style={styles.noCardsContainer}>
      <Text style={styles.noCardsText}>No Cards in this Scene</Text>
    </View>
    if (this.props.navigation.state.params.cards.length > 0) {
      body = <FlatList
        style={styles.list}
        data={this.props.navigation.state.params.cards}
        keyExtractor={(card) => card.id}
        renderItem={({item}) => this.renderItem(item)}
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
})

SceneView.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    state: PropTypes.shape({
      params: PropTypes.shape({
        scene: PropTypes.object.isRequired,
        cards: PropTypes.array.isRequired,
      })
    }).isRequired,
  }).isRequired,
  scenes: PropTypes.array.isRequired,
  lines: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  return {
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
