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
import HeaderTitle from './headerTitle'

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
      headerTitle: <HeaderTitle title='Character Details'/>,
      headerRight: right,
    }
  }

  constructor(props) {
    super(props)
    const { character } = props.navigation.state.params
    let customAttrs = this.props.customAttributes.reduce((obj, attr) => {
      obj[attr] = character[attr]
      return obj
    }, {})
    this.state = {
      name: character.name,
      description: character.description,
      notes: character.notes,
      ...customAttrs,
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

  customAttrChanged = (text, attr) => {
    this.props.navigation.setParams({dirty: true})
    this.setState({[attr]: text})
  }

  renderName = ({item}) => {
    return <View style={styles.inputWrapper}>
      <TextInput onChangeText={this.nameChanged} style={styles.input} multiline={true} defaultValue={item}/>
    </View>
  }

  renderDescription = ({item}) => {
    return <View style={styles.inputWrapper}>
      <TextInput onChangeText={this.descriptionChanged} style={styles.input} multiline={true} defaultValue={item}/>
    </View>
  }

  renderNotes = ({item}) => {
    return <View style={styles.inputWrapper}>
      <TextInput onChangeText={this.notesChanged} style={styles.input} multiline={true} defaultValue={item}/>
    </View>
  }

  renderCustomAttr = ({item}) => {
    const { character } = this.props.navigation.state.params
    return <View style={styles.inputWrapper}>
      <TextInput onChangeText={(text) => this.customAttrChanged(text, item)}style={styles.input} multiline={true} defaultValue={character[item]}/>
    </View>
  }

  render () {
    const { character } = this.props.navigation.state.params
    let customAttrs = this.prepareCustomAttributes()
    return <View style={styles.container}>
      <SectionList
        sections={[
          {data: [character.name || ''], title: 'Name', renderItem: this.renderName},
          {data: [character.description || ''], title: 'Description', renderItem: this.renderDescription},
          ...customAttrs,
          {data: [character.notes || ''], title: 'Notes', renderItem: this.renderNotes},
        ]}
        renderSectionHeader={({section}) => <View style={styles.sectionHeader}><Text style={styles.sectionHeaderText}>{section.title}</Text></View>}
        keyExtractor={(item, index) => `${item.substring(0, 3)}-${index}`}
      />
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
        character: PropTypes.object.isRequired,
      })
    }).isRequired,
  }).isRequired,
  customAttributes: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  return {
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
