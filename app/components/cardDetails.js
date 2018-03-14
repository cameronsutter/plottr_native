import _ from 'lodash'
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
  Picker,
  LayoutAnimation,
  ActivityIndicator,
  Alert,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import AppStyles from '../styles'
import HeaderTitle from './headerTitle'
import SaveButton from './saveButton'
import DeleteButton from './deleteButton'

class CardDetails extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state
    let right = null
    if (params.newCard) {
      right = <ActivityIndicator/>
    } else if (params.dirty) {
      let func = params.handleSave ? params.handleSave : () => null
      right = <SaveButton onPress={func}/>
    } else {
      right = <Text style={styles.green}>Saved</Text>
    }
    return {
      headerTitle: <HeaderTitle title='Card Details'/>,
      headerRight: right,
    }
  }

  constructor(props) {
    super(props)
    const { params } = props.navigation.state
    this.renderedLines = this.renderLines()
    this.renderedScenes = this.renderScenes()
    if (params.newCard) {
      this.state = {
        newCard: true,
      }
    } else {
      const { card } = params
      this.state = {
        ...card,
        editLine: false,
        editScene: false,
      }
      this.title = card.title
      this.description = card.description
    }
  }

  handleSave = () => {
    let title = this.state.title
    let desc = this.state.description
    if (title == '') title = 'New Card'
    this.props.actions.editCard(this.state.id, title, desc)
    this.props.actions.editCardCoordinates(this.state.id, this.state.lineId, this.state.sceneId)
    this.props.navigation.setParams({dirty: false})
    LayoutAnimation.easeInEaseOut()
    this.setState({editLine: false, editScene: false})
  }

  componentWillMount () {
    this.props.navigation.setParams({handleSave: this.handleSave})
    if (this.state.newCard) {
      this.props.actions.addCard(this.buildNewCard())
      setTimeout(this.findNewCard, 500)
    }
  }

  buildNewCard () {
    return {
      title: '',
      description: '',
      lineId: 0,
      sceneId: this.props.navigation.state.params.sceneId,
      tags: [],
      characters: [],
      places: [],
    }
  }

  findNewCard = () => {
    let card = this.props.cards[0]
    if (card.title == '') {
      this.setState({newCard: false, ...card})
      this.props.navigation.setParams({newCard: false, dirty: true})
    }
  }

  titleChanged = (text) => {
    this.props.navigation.setParams({dirty: true})
    this.setState({title: text})
  }

  descriptionChanged = (text) => {
    this.props.navigation.setParams({dirty: true})
    this.setState({description: text})
  }

  deleteCard = () => {
    Alert.alert(
      'Are you sure you want to delete',
      `${this.state.title}?`,
      [
        {text: 'Yes', onPress: () => {
          this.props.actions.deleteCard(this.state.id)
          this.props.navigation.goBack()
        }},
        {text: 'No', onPress: () => {}, style: 'cancel'},
      ]
    )
  }

  renderTitle = ({item}) => {
    if (item === 'blank') item = ''
    return <View style={styles.inputWrapper}>
      <TextInput onChangeText={this.titleChanged} style={styles.input} multiline={true} defaultValue={item}/>
    </View>
  }

  renderDescription = ({item}) => {
    if (item === 'blank') item = ''
    return <View style={styles.inputWrapper}>
      <TextInput onChangeText={this.descriptionChanged} style={styles.input} multiline={true} defaultValue={item}/>
    </View>
  }

  renderLines = () => {
    return this.props.lines.map((l) => <Picker.Item key={`l-${l.id}`} label={l.title} value={l.id}/> )
  }

  toggleEditLine = () => {
    LayoutAnimation.easeInEaseOut()
    let newValue = true
    if (this.state.editLine) {
      newValue = false
    }
    this.setState({editLine: newValue})
  }

  changeLine = (value) => {
    this.setState({lineId: parseInt(value)})
    this.props.navigation.setParams({dirty: true})
  }

  renderLine = ({index, item}) => {
    let line = _.find(this.props.lines, {id: this.state.lineId})
    let color = {color: line.color}
    let picker = null
    if (this.state.editLine) {
      picker = <Picker
          selectedValue={this.state.lineId}
          onValueChange={this.changeLine}
        >
        { this.renderedLines }
      </Picker>
    }
    return <View>
      <TouchableOpacity onPress={this.toggleEditLine}>
        <View style={styles.fakeInputWrapper}>
          <Text style={[styles.input, color]}>{line.title}</Text>
        </View>
      </TouchableOpacity>
      { picker }
    </View>
  }

  renderScenes = () => {
    return this.props.scenes.map((s) => <Picker.Item key={`s-${s.id}`} label={s.title} value={s.id}/> )
  }

  toggleEditScene = () => {
    LayoutAnimation.easeInEaseOut()
    let newValue = true
    if (this.state.editScene) {
      newValue = false
    }
    this.setState({editScene: newValue})
  }

  changeScene = (value) => {
    this.setState({sceneId: parseInt(value)})
    this.props.navigation.setParams({dirty: true})
  }

  renderScene = ({index, item}) => {
    let line = _.find(this.props.scenes, {id: this.state.sceneId})
    let picker = null
    if (this.state.editScene) {
      picker = <Picker
        selectedValue={this.state.sceneId}
        onValueChange={this.changeScene}
        >
        { this.renderedScenes }
      </Picker>
    }
    return <View>
      <TouchableOpacity onPress={this.toggleEditScene}>
        <View style={styles.fakeInputWrapper}>
          <Text style={styles.input}>{line.title}</Text>
        </View>
      </TouchableOpacity>
      { picker }
    </View>
  }

  render () {
    if (this.state.newCard) {
      return <ActivityIndicator/>
    } else {
      return <View style={styles.container}>
        <SectionList
          sections={[
            {data: [this.title || 'blank'], title: 'Title', renderItem: this.renderTitle},
            {data: ['lineId'], title: 'Line', renderItem: this.renderLine},
            {data: ['sceneId'], title: 'Scene', renderItem: this.renderScene},
            {data: [this.description || 'blank'], title: 'Description', renderItem: this.renderDescription},
          ]}
          renderSectionHeader={({section}) => <View style={styles.sectionHeader}><Text style={styles.sectionHeaderText}>{section.title}</Text></View>}
          keyExtractor={(item, index) => `${item.substring(0, 3)}-${index}`}
        />
        <DeleteButton onPress={this.deleteCard}/>
      </View>
    }
  }
}

const styles = StyleSheet.create({
  container: AppStyles.detailsView,
  sectionHeader: AppStyles.sectionHeader,
  sectionHeaderText: AppStyles.sectionHeaderText,
  input: AppStyles.input,
  green: AppStyles.greenSaved,
  inputWrapper: AppStyles.inputWrapper,
  fakeInputWrapper: {
    ...AppStyles.inputWrapper,
    paddingTop: 5,
  },
})

CardDetails.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    state: PropTypes.shape({
      params: PropTypes.shape({
        card: PropTypes.object,
      })
    }).isRequired,
  }).isRequired,
  cards: PropTypes.array.isRequired,
  lines: PropTypes.array.isRequired,
  scenes: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  return {
    cards: state.cards,
    lines: state.lines,
    scenes: state.scenes,
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
