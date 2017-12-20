import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { characterActions } from 'pltr'
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

class CharacterDetails extends Component {
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
      title: `${params.character.name}`,
      headerRight: right,
    }
  }

  constructor(props) {
    const { character } = props.navigation.state.params
    super(props)
    this.state = {
      name: character.name,
      description: character.description,
      notes: character.notes,
    }
  }

  handleSave = () => {
    const { character } = this.props.navigation.state.params
    this.props.actions.editCharacter(character.id, this.state)
    this.props.navigation.setParams({dirty: false})
  }

  componentWillMount () {
    this.props.navigation.setParams({handleSave: this.handleSave})
  }

  nameChanged = (text) => {
    this.props.navigation.setParams({dirty: true})
    this.setState({name: text})
  }

  descriptionChanged = (text) => {
    this.props.navigation.setParams({dirty: true})
    this.setState({description: text})
  }

  notesChanged = (text) => {
    this.props.navigation.setParams({dirty: true})
    this.setState({notes: text})
  }

  renderName = ({index, item}) => {
    return <View style={styles.inputWrapper}>
      <TextInput onChangeText={this.nameChanged} style={styles.input} multiline={true} defaultValue={item}/>
    </View>
  }

  renderDescription = ({index, item}) => {
    return <View style={styles.inputWrapper}>
      <TextInput onChangeText={this.descriptionChanged} style={styles.input} multiline={true} defaultValue={item}/>
    </View>
  }

  renderNotes = ({index, item}) => {
    return <View style={styles.inputWrapper}>
      <TextInput onChangeText={this.notesChanged} style={styles.input} multiline={true} defaultValue={item}/>
    </View>
  }

  render () {
    const { character } = this.props.navigation.state.params
    return <View style={styles.container}>
      <SectionList
        sections={[
          {data: [character.name || ''], title: 'Name', renderItem: this.renderName},
          {data: [character.description || ''], title: 'Description', renderItem: this.renderDescription},
          {data: [character.notes || ''], title: 'Notes', renderItem: this.renderNotes},
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

CharacterDetails.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    state: PropTypes.shape({
      params: PropTypes.shape({
        character: PropTypes.object.isRequired,
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
    actions: bindActionCreators(characterActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CharacterDetails)
