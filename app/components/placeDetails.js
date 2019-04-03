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
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import AppStyles from '../styles'
import HeaderTitle from './headerTitle'
import SaveButton from './saveButton'
import DeleteButton from './deleteButton'

class PlaceDetails extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state
    let right = null
    if (params.newPlace) {
      right = <ActivityIndicator/>
    } else if (params.dirty) {
      let func = params.handleSave ? params.handleSave : () => null
      right = <SaveButton onPress={func}/>
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
    const { params } = props.navigation.state
    if (params.newPlace) {
      this.state = {
        newPlace: true,
      }
    } else {
      let customAttrs = this.props.customAttributes.reduce((obj, attr) => {
        obj[attr] = params.place[attr]
        return obj
      }, {})
      this.state = {
        id: params.place.id,
        name: params.place.name,
        description: params.place.description,
        notes: params.place.notes,
        ...customAttrs,
      }
      this.place = {...this.state}
    }
  }

  handleSave = () => {
    this.props.actions.editPlace(this.place.id, this.state)
    this.props.navigation.setParams({dirty: false})
  }

  componentWillMount () {
    this.props.navigation.setParams({handleSave: this.handleSave})
    if (this.state.newPlace) {
      this.props.actions.addPlace()
      setTimeout(this.findNewPlace, 500)
    }
  }


  findNewPlace = () => {
    let place = this.props.places[this.props.places.length - 1] // places add new ones to the end
    if (place.name == '') {
      this.place = place
      let customAttrs = this.props.customAttributes.reduce((obj, attr) => {
        obj[attr] = place[attr]
        return obj
      }, {})
      this.setState({
        newPlace: false,
        name: place.name || 'New place',
        description: place.description,
        notes: place.notes,
        ...customAttrs,
      })
      this.props.navigation.setParams({newPlace: false, dirty: true})
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

  deletePlace = () => {
    Alert.alert(
      'Are you sure you want to delete',
      `${this.place.name}?`,
      [
        {text: 'Yes', onPress: () => {
          this.props.actions.deletePlace(this.place.id)
          this.props.navigation.goBack()
        }},
        {text: 'No', onPress: () => {}, style: 'cancel'},
      ]
    )
  }

  renderName = ({item}) => {
    if (item === 'blank') item = ''
    return <View style={styles.inputWrapper}>
      <TextInput onChangeText={this.nameChanged} style={styles.input}
        defaultValue={item} clearButtonMode='while-editing'/>
    </View>
  }

  renderDescription = ({item}) => {
    if (item === 'blank') item = ''
    return <View style={styles.inputWrapper}>
      <TextInput onChangeText={this.descriptionChanged} style={styles.input}
        defaultValue={item} clearButtonMode='while-editing'/>
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
      <TextInput onChangeText={(text) => this.customAttrChanged(text, item)}
        style={styles.input} defaultValue={this.place[item]}
        clearButtonMode='while-editing'/>
    </View>
  }

  render () {
    if (this.state.newPlace) return <ActivityIndicator/>
    let customAttrs = this.prepareCustomAttributes()
    return <KeyboardAvoidingView style={styles.container} behavior={'position'} keyboardVerticalOffset={-110}>
      <SectionList
        keyboardShouldPersistTaps='always'
        style={{paddingBottom: 300}}
        sections={[
          {data: [this.place.name || 'blank'], title: 'Name', renderItem: this.renderName},
          {data: [this.place.description || 'blank'], title: 'Short Description', renderItem: this.renderDescription},
          ...customAttrs,
          {data: [this.place.notes || 'blank'], title: 'Notes', renderItem: this.renderNotes},
        ]}
        renderSectionHeader={({section}) => <View style={styles.sectionHeader}><Text style={styles.sectionHeaderText}>{section.title}</Text></View>}
        keyExtractor={(attr, index) => `${attr.substring(0, 3)}-${index}`}
      />
      <DeleteButton onPress={this.deletePlace}/>
    </KeyboardAvoidingView>
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
        place: PropTypes.object,
      })
    }).isRequired,
  }).isRequired,
  places: PropTypes.array.isRequired,
  customAttributes: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  return {
    places: state.places,
    customAttributes: state.customAttributes['places'],
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
