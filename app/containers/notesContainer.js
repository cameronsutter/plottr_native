import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { noteActions } from 'pltr'
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

class NotesContainer extends Component {
  static navigationOptions = {
    headerTitle: <HeaderTitle title='Notes'/>
  }

  renderItem = (note) => {
    return <View key={`note-${note.id}`} style={styles.listItem}>
      <TouchableOpacity onPress={() => this.props.navigation.navigate('Details', {note})}>
        <View style={styles.touchableItem}>
          <Text style={styles.touchableItemText}>{note.title}</Text>
          <Icon name={'angle-right'} size={25}></Icon>
        </View>
      </TouchableOpacity>
    </View>
  }

  render () {
    return <View style={styles.container}>
      <FlatList
        data={this.props.notes}
        keyExtractor={(note) => note.id}
        renderItem={({item}) => this.renderItem(item)}
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
  },
})

NotesContainer.propTypes = {
  navigation: PropTypes.object.isRequired,
  notes: PropTypes.array.isRequired,
}

function mapStateToProps (state) {
  return {
    notes: state.notes
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(noteActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotesContainer)
