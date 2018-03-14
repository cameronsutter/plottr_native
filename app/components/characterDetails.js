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
  ActivityIndicator,
  Alert,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import AppStyles from '../styles'
import HeaderTitle from './headerTitle'
import SaveButton from './saveButton'
import DeleteButton from './deleteButton'

class CharacterDetails extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state
    let right = null
    if (params.newCharacter) {
      right = <ActivityIndicator/>
    } else if (params.dirty) {
      let func = params.handleSave ? params.handleSave : () => null
      right = <SaveButton onPress={func} />
    } else {
      right = <Text style={styles.green}>Saved</Text>
    }
    return {
      headerTitle: <HeaderTitle title='Character Details'/>,
      headerRight: right,
    }
  }

  constructor(props) {
    super(props)
    const { params } = props.navigation.state
    if (params.newCharacter) {
      this.state = {
        newCharacter: true,
      }
    } else {
      let customAttrs = props.customAttributes.reduce((obj, attr) => {
        obj[attr] = params.character[attr]
        return obj
      }, {})
      this.state = {
        id: params.character.id,
        name: params.character.name,
        description: params.character.description,
        notes: params.character.notes,
        ...customAttrs,
      }
      this.character = {...this.state}
    }
  }

  handleSave = () => {
    this.props.actions.editCharacter(this.character.id, this.state)
    this.props.navigation.setParams({dirty: false})
  }

  componentWillMount () {
    this.props.navigation.setParams({handleSave: this.handleSave})
    if (this.state.newCharacter) {
      this.props.actions.addCharacter()
      setTimeout(this.findNewCharacter, 500)
    }
  }

  findNewCharacter = () => {
    let character = this.props.characters[this.props.characters.length - 1] // characters add new ones to the end
    if (character.name == '') {
      this.character = character
      let customAttrs = this.props.customAttributes.reduce((obj, attr) => {
        obj[attr] = character[attr]
        return obj
      }, {})
      this.setState({
        newCharacter: false,
        name: character.name || 'New character',
        description: character.description,
        notes: character.notes,
        ...customAttrs,
      })
      this.props.navigation.setParams({newCharacter: false, dirty: true})
    }
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

  customAttrChanged = (text, attr) => {
    this.props.navigation.setParams({dirty: true})
    this.setState({[attr]: text})
  }

  deleteCharacter = () => {
    Alert.alert(
      'Are you sure you want to delete',
      `${this.character.name}?`,
      [
        {text: 'Yes', onPress: () => {
          this.props.actions.deleteCharacter(this.character.id)
          this.props.navigation.goBack()
        }},
        {text: 'No', onPress: () => {}, style: 'cancel'},
      ]
    )
  }

  renderName = ({item}) => {
    if (item === 'blank') item = ''
    return <View style={styles.inputWrapper}>
      <TextInput onChangeText={this.nameChanged} style={styles.input} multiline={true} defaultValue={item}/>
    </View>
  }

  renderDescription = ({item}) => {
    if (item === 'blank') item = ''
    return <View style={styles.inputWrapper}>
      <TextInput onChangeText={this.descriptionChanged} style={styles.input} multiline={true} defaultValue={item}/>
    </View>
  }

  renderNotes = ({item}) => {
    if (item === 'blank') item = ''
    return <View style={styles.inputWrapper}>
      <TextInput onChangeText={this.notesChanged} style={styles.input} multiline={true} defaultValue={item}/>
    </View>
  }

  renderCustomAttr = ({item}) => {
    return <View style={styles.inputWrapper}>
      <TextInput onChangeText={(text) => this.customAttrChanged(text, item)}style={styles.input} multiline={true} defaultValue={this.character[item]}/>
    </View>
  }

  render () {
    if (this.state.newCharacter) return <ActivityIndicator/>
    let customAttrs = this.prepareCustomAttributes()
    return <View style={styles.container}>
      <SectionList
        sections={[
          {data: [this.character.name || 'blank'], title: 'Name', renderItem: this.renderName},
          {data: [this.character.description || 'blank'], title: 'Short Description', renderItem: this.renderDescription},
          ...customAttrs,
          {data: [this.character.notes || 'blank'], title: 'Notes', renderItem: this.renderNotes},
        ]}
        renderSectionHeader={({section}) => <View style={styles.sectionHeader}><Text style={styles.sectionHeaderText}>{section.title}</Text></View>}
        keyExtractor={(item, index) => `${item.substring(0, 3)}-${index}`}
      />
      <DeleteButton onPress={this.deleteCharacter}/>
    </View>
  }

  prepareCustomAttributes () {
    return this.props.customAttributes.map(attr => {
      return { data: [attr], title: attr, renderItem: this.renderCustomAttr }
    })
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
        character: PropTypes.object,
      })
    }).isRequired,
  }).isRequired,
  characters: PropTypes.array.isRequired,
  customAttributes: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  return {
    characters: state.characters,
    customAttributes: state.customAttributes['characters'],
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
