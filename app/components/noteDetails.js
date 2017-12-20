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
  Button,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import AppStyles from '../styles'

class NoteDetails extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state
    let right = null
    if (params.dirty) {
      right = <Button
        title='Save'
        onPress={params.handleSave ? params.handleSave : () => null}
      />
    } else {
      right = <Text style={styles.green}>Saved</Text>
    }
    return {
      title: `${params.note.title}`,
      headerRight: right,
    }
  }

  constructor(props) {
    const { note } = props.navigation.state.params
    super(props)
    this.state = {
      title: note.title,
      content: note.content,
    }
  }

  handleSave = () => {
    const { note } = this.props.navigation.state.params
    this.props.actions.editNote(note.id, this.state)
    this.props.navigation.setParams({dirty: false})
  }

  componentWillMount () {
    this.props.navigation.setParams({handleSave: this.handleSave})
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
    const { note } = this.props.navigation.state.params
    return <View style={styles.container}>
      <SectionList
        sections={[
          {data: [note.title || ''], title: 'Title', renderItem: this.renderTitle},
          {data: [note.content || ''], title: 'Content', renderItem: this.renderContent},
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
        note: PropTypes.object.isRequired,
      })
    }).isRequired,
  }).isRequired,
  actions: PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  return {
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
