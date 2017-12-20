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

class PlaceDetails extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state
    let button = <Button
      title='Save'
      onPress={params.handleSave ? params.handleSave : () => null}
    />
    return {
      title: `${params.place.title}`,
      headerRight: button,
    }
  }

  constructor(props) {
    const { place } = props.navigation.state.params
    super(props)
    this.state = {
      name: place.name,
      description: place.description,
      notes: place.notes,
    }
  }

  handleSave = () => {
    const { place } = this.props.navigation.state.params
    this.props.actions.editPlace(place.id, this.state)
  }

  componentWillMount () {
    this.props.navigation.setParams({handleSave: this.handleSave})
  }

  renderName = ({index, item}) => {
    return <View style={styles.name}>
      <TextInput onChangeText={(text) => this.setState({name: text})} multiline={true} defaultValue={item}/>
    </View>
  }

  renderDescription = ({index, item}) => {
    return <View style={styles.description}>
      <TextInput onChangeText={(text) => this.setState({description: text})} multiline={true} defaultValue={item}/>
    </View>
  }

  renderNotes = ({index, item}) => {
    return <View style={styles.notes}>
      <TextInput onChangeText={(text) => this.setState({notes: text})} multiline={true} defaultValue={item}/>
    </View>
  }

  render () {
    const { place } = this.props.navigation.state.params
    return <View style={styles.container}>
      <SectionList
        sections={[
          {data: [place.name || ''], title: 'Name', renderItem: this.renderName},
          {data: [place.description || ''], title: 'Description', renderItem: this.renderDescription},
          {data: [place.notes || ''], title: 'Notes', renderItem: this.renderNotes},
        ]}
        renderSectionHeader={({section}) => <View style={styles.sectionHeader}><Text style={styles.sectionHeaderText}>{section.title}</Text></View>}
        keyExtractor={(attr, index) => `${attr.substring(0, 3)}-${index}`}
      />
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  name: {
    padding: 10,
  },
  description: {
    padding: 10,
  },
  notes: {
    padding: 10,
  },
  sectionHeader: {
    padding: 10,
    alignSelf: 'stretch',
    backgroundColor: '#ddd',
    marginBottom: 5,
  },
  sectionHeaderText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
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
  actions: PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  return {
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
