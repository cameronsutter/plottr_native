import _ from 'lodash'
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
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import AppStyles from '../styles'
import * as vars from '../styles/vars'
import HeaderTitle from './headerTitle'
import SaveButton from './saveButton'
import DeleteButton from './deleteButton'

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
    this.state = {
      isNewNote: !!params.newNote,
      note: params.note,
    }
  }

  handleSave = () => {
    this.props.actions.editNote(this.state.note.id, this.state.note)
    this.props.navigation.setParams({dirty: false})
    this.scrollView.scrollToLocation({sectionIndex: 0, itemIndex: 0, viewOffset: 45})
  }

  componentWillMount () {
    this.props.navigation.setParams({handleSave: this.handleSave})
    if (this.state.isNewNote) {
      this.props.actions.addNote()
      setTimeout(this.findNewNote, 500)
    }
  }

  findNewNote = () => {
    let note = this.props.notes[this.props.notes.length - 1] // notes add new ones to the end
    if (note.title == '') {
      this.setState({isNewNote: false, note})
      this.props.navigation.setParams({newNote: false, dirty: true})
    }
  }

  componentWillReceiveProps (newProps) {
    if (!this.state.isNewNote) {
      let note = _.find(newProps.notes, {id: this.state.note.id})
      if (note) {
        this.setState({ note })
      }
    }
  }

  titleChanged = (text) => {
    const { navigation } = this.props
    if (!navigation.state.params.dirty) navigation.setParams({dirty: true})
    let note = this.state.note
    note.title = text
    this.setState({ note })
  }

  contentChanged = (text) => {
    const { navigation } = this.props
    if (!navigation.state.params.dirty) navigation.setParams({dirty: true})
    let note = this.state.note
    note.content = text
    this.setState({ note })
  }

  deleteNote = () => {
    Alert.alert(
      'Are you sure you want to delete',
      `${this.state.note.title}?`,
      [
        {text: 'Yes', onPress: () => {
          this.props.actions.deleteNote(this.state.note.id)
          this.props.navigation.goBack()
        }},
        {text: 'No', onPress: () => {}, style: 'cancel'},
      ]
    )
  }

  renderTitle = () => {
    return <View style={styles.inputWrapper}>
      <TextInput onChangeText={this.titleChanged} style={styles.input}
        defaultValue={this.state.note.title} clearButtonMode='while-editing'/>
    </View>
  }

  renderContent = () => {
    return <View style={styles.inputWrapper}>
      <TextInput onFocus={this.scroll} onChangeText={this.contentChanged} style={styles.input} multiline={true} defaultValue={this.state.note.content}/>
    </View>
  }

  scroll = () => {
    try {
      this.scrollView.scrollToLocation({sectionIndex: 2, itemIndex: 0, viewOffset: 45})
    } catch (error) {
      console.log(error)
    }
  }

  renderAttachments = () => {
    const { navigation } = this.props
    const { note } = this.state
    let characterLengthText = note.characters.length > 0 ? ` (${note.characters.length})` : ''
    let placeLengthText = note.places.length > 0 ? ` (${note.places.length})` : ''
    let tagLengthText = note.tags.length > 0 ? ` (${note.tags.length})` : ''
    return <View>
      <View style={styles.listItem}>
        <TouchableOpacity onPress={() => navigation.navigate('Attachments', {type: 'characters', noteId: note.id, selected: note.characters})}>
          <View style={styles.attachmentItem}>
            <Text style={styles.attachmentItemText}>Characters{characterLengthText}</Text><Icon name={'angle-right'} size={25}></Icon>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.listItem}>
        <TouchableOpacity onPress={() => navigation.navigate('Attachments', {type: 'places', noteId: note.id, selected: note.places})}>
          <View style={styles.attachmentItem}>
            <Text style={styles.attachmentItemText}>Places{placeLengthText}</Text><Icon name={'angle-right'} size={25}></Icon>
          </View>
        </TouchableOpacity>
      </View>
      <View style={[styles.listItem, {borderBottomWidth: 0}]}>
        <TouchableOpacity onPress={() => navigation.navigate('Attachments', {type: 'tags', noteId: note.id, selected: note.tags})}>
          <View style={styles.attachmentItem}>
            <Text style={styles.attachmentItemText}>Tags{tagLengthText}</Text><Icon name={'angle-right'} size={25}></Icon>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  }

  render () {
    if (this.state.isNewNote) return <ActivityIndicator/>
    return <View style={styles.container}>
      <SectionList
        ref={(ref) => this.scrollView = ref}
        style={{paddingBottom: 300}}
        sections={[
          {data: ['title'], title: 'Title', renderItem: this.renderTitle},
          {data: ['attachments'], title: 'Attachments', renderItem: this.renderAttachments},
          {data: ['content'], title: 'Content', renderItem: this.renderContent},
        ]}
        renderSectionHeader={({section}) => <View style={styles.sectionHeader}><Text style={styles.sectionHeaderText}>{section.title}</Text></View>}
        keyExtractor={(item, index) => `${item.substring(0, 3)}-${index}`}
      />
      <DeleteButton onPress={this.deleteNote}/>
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
  listItem: AppStyles.listItem,
  attachmentItem: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  attachmentItemText: {
    ...Platform.select({
      android: {
        color: vars.black,
      }
    }),
  }
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
