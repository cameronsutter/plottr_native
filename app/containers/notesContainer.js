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
import AddButton from '../components/addButton'
import MenuButton from '../components/menuButton'

class NotesContainer extends Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    let { params } = navigation.state
    params = params || {}
    return {
      headerLeft: <MenuButton close={screenProps.close} />,
      headerTitle: <HeaderTitle title='Notes'/>,
      headerRight: <AddButton onPress={params.addNote ? params.addNote : () => null}/>,
    }
  }

  addNote = () => {
    this.props.navigation.navigate('Details', {newNote: true})
  }

  componentDidMount () {
    this.props.navigation.setParams({addNote: this.addNote})
  }

  renderItem = (note) => {
    return <View key={`note-${note.id}`} style={styles.listItem}>
      <TouchableOpacity onPress={() => this.props.navigation.navigate('Details', {note})}>
        <View style={styles.touchableItem}>
          <View>
            <Text style={styles.titleText}>{note.title}</Text>
            <Text style={styles.descriptionText}>{note.content.substring(0, 100)}</Text>
          </View>
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
  descriptionText: AppStyles.descriptionText,
  titleText: AppStyles.titleText,
})

NotesContainer.propTypes = {
  navigation: PropTypes.object.isRequired,
  notes: PropTypes.array.isRequired,
}

function mapStateToProps (state) {
  return {
    notes: state.notes,
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
