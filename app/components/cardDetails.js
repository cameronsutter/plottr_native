import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { cardActions } from 'pltr'
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

class CardDetails extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state
    let button = <Button
      title='Save'
      onPress={params.handleSave ? params.handleSave : () => null}
    />
    return {
      title: `${params.card.title}`,
      headerRight: button,
    }
  }

  constructor(props) {
    const { card } = props.navigation.state.params
    super(props)
    this.state = {
      title: card.title,
      description: card.description,
    }
  }

  handleSave = () => {
    const { card } = this.props.navigation.state.params
    this.props.actions.editCard(card.id, this.state.title, this.state.description)
  }

  componentWillMount () {
    this.props.navigation.setParams({handleSave: this.handleSave})
  }

  renderTitle = ({index, item}) => {
    return <View style={styles.title}>
      <TextInput onChangeText={(text) => this.setState({title: text})} multiline={true} defaultValue={item}/>
    </View>
  }

  renderDescription = ({index, item}) => {
    return <View style={styles.content}>
      <TextInput onChangeText={(text) => this.setState({description: text})} multiline={true} defaultValue={item}/>
    </View>
  }

  render () {
    const { card } = this.props.navigation.state.params
    return <View style={styles.container}>
      <SectionList
        sections={[
          {data: [card.title || ''], title: 'Title', renderItem: this.renderTitle},
          {data: [card.description || ''], title: 'Description', renderItem: this.renderDescription},
        ]}
        renderSectionHeader={({section}) => <View style={styles.sectionHeader}><Text style={styles.sectionHeaderText}>{section.title}</Text></View>}
        keyExtractor={(item, index) => `${item.substring(0, 3)}-${index}`}
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
  title: {
    padding: 10,
  },
  content: {
    padding: 10,
  },
  sectionHeader: {
    padding: 10,
    alignSelf: 'stretch',
    backgroundColor: '#eee',
    marginBottom: 5,
  },
  sectionHeaderText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

CardDetails.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    state: PropTypes.shape({
      params: PropTypes.shape({
        card: PropTypes.object.isRequired,
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
    actions: bindActionCreators(cardActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CardDetails)
