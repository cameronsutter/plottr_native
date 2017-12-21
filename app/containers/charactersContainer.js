import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { characterActions } from 'pltr'
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import AppStyles from '../styles'
import HeaderTitle from '../components/headerTitle'

class CharactersContainer extends Component {
  static navigationOptions = {
    headerTitle: <HeaderTitle title='Characters'/>
  }

  renderItem = (character) => {
    return <View key={`character-${character.id}`} style={styles.listItem}>
      <TouchableOpacity onPress={() => this.props.navigation.navigate('Details', {character})}>
        <View style={styles.touchableItem}>
          <View>
            <Text style={styles.nameText}>{character.name}</Text>
            <Text style={styles.descriptionText}>{character.description}</Text>
          </View>
          <Icon name={'angle-right'} size={25}></Icon>
        </View>
      </TouchableOpacity>
    </View>
  }

  render () {
    return <View style={styles.container}>
      <FlatList
        data={this.props.characters}
        keyExtractor={(character) => character.id}
        renderItem={({item}) => this.renderItem(item)}
      />
    </View>
  }
}

const styles = StyleSheet.create({
  container: AppStyles.containerView,
  listItem: AppStyles.listItem,
  touchableItem: AppStyles.touchableItem,
  descriptionText: AppStyles.descriptionText,
  nameText: {
    fontSize: 16,
  },
})

CharactersContainer.propTypes = {
  navigation: PropTypes.object.isRequired,
  characters: PropTypes.array.isRequired,
}

function mapStateToProps (state) {
  return {
    characters: state.characters
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(characterActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CharactersContainer)
