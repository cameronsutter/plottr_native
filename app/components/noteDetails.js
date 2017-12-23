import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { noteActions } from 'pltr'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  SectionList,
  ActivityIndicator,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import AppStyles from '../styles'
import HeaderTitle from './headerTitle'
import SaveButton from './saveButton'

class NoteDetails extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state
    let right = null
    if (params.newNote) {
      right = <ActivityIndicator/>
    } else if (params.dirty) {
      let func = params.handleSave ? params.handleSave : () => null
      right = <SaveButton onPress={func} />
    } else {
      right = <Text style={styles.green}>Saved</Text>
    }
    return {
      headerTitle: <HeaderTitle title='Note Details'/>,
      headerRight: right,
    }
  }

  constructor(props) {
    super(props)
    const { params } = props.navigation.state
    if (params.newNote) {
      this.state = {
        newNote: true,
      }
      this.title = 'New Note'
      this.content = 'note contents go here'
    } else {
      this.state = {
        title: params.note.title,
        content: params.note.content,
      }
      this.title = params.note.title || 'Note title'
      this.content = params.note.content || 'note content goes here'
    }
  }

  handleSave = () => {
    const { note } = this.props.navigation.state.params
    let id = (note && note.id) || this.state.id
    this.props.actions.editNote(id, {title: this.state.title, content: this.state.content})
    this.props.navigation.setParams({dirty: false})
  }

  componentWillMount () {
    this.props.navigation.setParams({handleSave: this.handleSave})
    if (this.state.newNote) {
      this.props.actions.addNote()
      setTimeout(this.findNewNote, 500)
    }
  }

  findNewNote = () => {
    let note = this.props.notes[this.props.notes.length - 1] // notes add new ones to the end
    if (note.title == '') {
      this.setState({newNote: false, id: note.id, title: this.title, content: this.content})
      this.props.navigation.setParams({newNote: false, dirty: true})
    }
  }

  titleChanged = (text) => {
    this.props.navigation.setParams({dirty: true})
    this.setState({title: text})
  }

  contentChanged = (text) => {
    this.props.navigation.setParams({dirty: true})
    this.setState({content: text})
  }

  renderTitle = ({index, item}) => {
    return <View style={styles.inputWrapper}>
      <TextInput onChangeText={this.titleChanged} style={styles.input} multiline={true} defaultValue={item}/>
    </View>
  }

  renderContent = ({index, item}) => {
    return <View style={styles.inputWrapper}>
      <TextInput onChangeText={this.contentChanged} style={styles.input} multiline={true} defaultValue={item}/>
    </View>
  }

  render () {
    if (this.state.newNote) return <ActivityIndicator/>
    return <View style={styles.container}>
      <SectionList
        sections={[
          {data: [this.title], title: 'Title', renderItem: this.renderTitle},
          {data: [this.content], title: 'Content', renderItem: this.renderContent},
        ]}
        renderSectionHeader={({section}) => <View style={styles.sectionHeader}><Text style={styles.sectionHeaderText}>{section.title}</Text></View>}
        keyExtractor={(item, index) => `${item.substring(0, 3)}-${index}`}
      />
    </View>
  }
}

const styles = StyleSheet.create({
  container: AppStyles.detailsView,
  sectionHeader: AppStyles.sectionHeader,
  sectionHeaderText: AppStyles.sectionHeaderText,
  input: AppStyles.input,
  green: AppStyles.greenSaved,
  inputWrapper: AppStyles.inputWrapper,
})

NoteDetails.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    state: PropTypes.shape({
      params: PropTypes.shape({
        note: PropTypes.object,
      })
    }).isRequired,
  }).isRequired,
  notes: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
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
)(NoteDetails)
