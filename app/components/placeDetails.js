import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { placeActions } from 'pltr'
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

class PlaceDetails extends Component {
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
      headerTitle: <HeaderTitle title='Place Details'/>,
      headerRight: right,
    }
  }

  constructor(props) {
    super(props)
    const { place } = props.navigation.state.params
    let customAttrs = this.props.customAttributes.reduce((obj, attr) => {
      obj[attr] = place[attr]
      return obj
    }, {})
    this.state = {
      name: place.name,
      description: place.description,
      notes: place.notes,
      ...customAttrs,
    }
  }

  handleSave = () => {
    const { place } = this.props.navigation.state.params
    this.props.actions.editPlace(place.id, this.state)
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

  renderCustomAttr = ({item}) => {
    const { place } = this.props.navigation.state.params
    return <View style={styles.inputWrapper}>
      <TextInput onChangeText={(text) => this.customAttrChanged(text, item)}style={styles.input} multiline={true} defaultValue={place[item]}/>
    </View>
  }

  render () {
    const { place } = this.props.navigation.state.params
    let customAttrs = this.prepareCustomAttributes()
    return <View style={styles.container}>
      <SectionList
        sections={[
          {data: [place.name || ''], title: 'Name', renderItem: this.renderName},
          {data: [place.description || ''], title: 'Description', renderItem: this.renderDescription},
          ...customAttrs,
          {data: [place.notes || ''], title: 'Notes', renderItem: this.renderNotes},
        ]}
        renderSectionHeader={({section}) => <View style={styles.sectionHeader}><Text style={styles.sectionHeaderText}>{section.title}</Text></View>}
        keyExtractor={(attr, index) => `${attr.substring(0, 3)}-${index}`}
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

PlaceDetails.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    state: PropTypes.shape({
      params: PropTypes.shape({
        place: PropTypes.object.isRequired,
      })
    }).isRequired,
  }).isRequired,
  customAttributes: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  return {
    customAttributes: state.customAttributes['places']
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(placeActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlaceDetails)
