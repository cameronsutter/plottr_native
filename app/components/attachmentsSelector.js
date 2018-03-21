import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { cardActions, noteActions } from 'pltr'
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AppStyles from '../styles'
import * as vars from '../styles/vars'
import HeaderTitle from './headerTitle'

class AttachmentsSelector extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state
    let title = params.cardId ? 'Attach to Card' : 'Attach to Note'
    switch (params.type) {
      case 'characters':
        title = 'Attach Characters'
        break
      case 'places':
        title = 'Attach Places'
        break
      case 'tags':
        title = 'Attach Tags'
        break
    }
    return {
      headerTitle: <HeaderTitle title={title}/>,
    }
  }

  constructor (props) {
    super(props)
    const { params } = props.navigation.state
    let list = props.characters.sort()
    switch (params.type) {
      case 'places':
        list = props.places.sort()
        break
      case 'tags':
        list = props.tags.sort()
        break
    }
    this.state = {
      list,
      type: params.type,
      isCard: params.cardId !== undefined, // otherwise it's a note
      selected: params.selected || [],
    }
  }

  componentWillReceiveProps (newProps) {
    let selected = newProps.item[this.state.type] || []
    this.setState({ selected })
  }

  addIt = (id) => {
    const { params } = this.props.navigation.state
    let itemId = params.cardId !== undefined ? params.cardId : params.noteId
    const { actions } = this.props
    switch (this.state.type) {
      case 'characters':
        return actions.addCharacter(itemId, id)
      case 'places':
        return actions.addPlace(itemId, id)
      case 'tags':
        return actions.addTag(itemId, id)
    }
  }

  removeIt = (id) => {
    const { params } = this.props.navigation.state
    let itemId = params.cardId !== undefined ? params.cardId : params.noteId
    const { actions } = this.props
    switch (this.state.type) {
      case 'characters':
        return actions.removeCharacter(itemId, id)
      case 'places':
        return actions.removePlace(itemId, id)
      case 'tags':
        return actions.removeTag(itemId, id)
    }
  }

  toggleItem = (id) => {
    let ids = this.state.selected
    if (ids.includes(id)) {
      this.removeIt(id)
    } else {
      this.addIt(id)
    }
  }

  renderCheck = (id) => {
    if (this.state.selected.includes(id)) {
      return <Ionicons name={'ios-checkmark-circle'} style={{color: vars.green}} size={30}></Ionicons>
    } else {
      return null
    }
  }

  renderItem = ({ item }) => {
    return <View key={`item-${item.id}`} style={styles.listItem}>
      <TouchableOpacity onPress={() => this.toggleItem(item.id)}>
        <View style={[styles.touchableItem, {height: 60}]}>
          <View>
            <Text style={styles.titleText}>{item.name || item.title}</Text>
          </View>
          {this.renderCheck(item.id)}
        </View>
      </TouchableOpacity>
    </View>
  }

  render () {
    return <View style={styles.container}>
      <FlatList
        data={this.state.list}
        extraData={this.state}
        keyExtractor={(item) => item.id}
        renderItem={this.renderItem}
      />
    </View>
  }
}

const styles = StyleSheet.create({
  container: AppStyles.containerView,
  listItem: AppStyles.listItem,
  touchableItem: AppStyles.touchableItem,
  descriptionText: AppStyles.descriptionText,
  titleText: AppStyles.titleText,
})

AttachmentsSelector.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    state: PropTypes.shape({
      params: PropTypes.shape({
        type: PropTypes.string.isRequired,
        cardId: PropTypes.number,
        noteId: PropTypes.number,
        selected: PropTypes.array,
      })
    }).isRequired,
  }).isRequired,
  characters: PropTypes.array.isRequired,
  places: PropTypes.array.isRequired,
  tags: PropTypes.array.isRequired,
  item: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
}

function mapStateToProps (state, props) {
  let item = {}
  if (props.navigation.state.params.cardId !== undefined) {
    item = _.find(state.cards, {id: props.navigation.state.params.cardId})
  } else {
    item = _.find(state.notes, {id: props.navigation.state.params.noteId})
  }
  return {
    characters: state.characters,
    places: state.places,
    tags: state.tags,
    item,
  }
}

function mapDispatchToProps (dispatch, props) {
  if (props.navigation.state.params.cardId !== undefined) { // a card, not a note
    return {
      actions: bindActionCreators(cardActions, dispatch),
    }
  }

  // a note, not a card
  return {
    actions: bindActionCreators(noteActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AttachmentsSelector)
