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
    this.state = {
      isNewCard: !!params.card.newCard,
      editLine: false,
      editScene: false,
      card: params.card,
    }
  }

  handleSave = () => {
    const { card } = this.state
    let title = card.title
    let desc = card.description
    if (title == '') title = 'New Card'
    this.props.actions.editCard(card.id, title, desc)
    this.props.actions.editCardCoordinates(card.id, card.lineId, card.sceneId)
    this.props.navigation.setParams({dirty: false})
    LayoutAnimation.easeInEaseOut()
    this.setState({editLine: false, editScene: false})
    this.scrollView.scrollToLocation({sectionIndex: 0, itemIndex: 0, viewOffset: 45})
  }

  componentWillMount () {
    this.props.navigation.setParams({handleSave: this.handleSave})
    if (this.state.isNewCard) {
      this.props.actions.addCard(this.buildNewCard())
      setTimeout(this.findNewCard, 500)
    }
  }

  buildNewCard = () => {
    return {
      title: '',
      description: '',
      lineId: this.state.card.lineId,
      sceneId: this.state.card.sceneId,
      tags: [],
      characters: [],
      places: [],
    }
  }

  findNewCard = () => {
    let card = this.props.cards[0]
    if (card.title == '') {
      this.setState({isNewCard: false, card})
      this.props.navigation.setParams({newCard: false, dirty: true})
    }
  }

  componentWillReceiveProps (newProps) {
    if (!this.state.newCard) {
      let card = _.find(newProps.cards, {id: this.state.card.id})
      if (card) {
        this.setState({ card })
      }
    }
  }

  titleChanged = (text) => {
    this.props.navigation.setParams({dirty: true})
    let card = this.state.card
    card.title = text
    this.setState({ card })
  }

  descriptionChanged = (text) => {
    this.props.navigation.setParams({dirty: true})
    let card = this.state.card
    card.description = text
    this.setState({ card })
  }

  deleteCard = () => {
    Alert.alert(
      'Are you sure you want to delete',
      `${this.state.card.title}?`,
      [
        {text: 'Yes', onPress: () => {
          this.props.actions.deleteCard(this.state.card.id)
          this.props.navigation.goBack()
        }},
        {text: 'No', onPress: () => {}, style: 'cancel'},
      ]
    )
  }

  renderTitle = () => {
    let title = this.state.card.title
    return <View style={styles.inputWrapper}>
      <TextInput autoFocus={title == ''} onChangeText={this.titleChanged} style={styles.input} multiline={true} defaultValue={title}/>
    </View>
  }

  renderDescription = () => {
    return <View style={styles.inputWrapper}>
      <TextInput onFocus={this.scroll} onChangeText={this.descriptionChanged} style={styles.input} multiline={true} defaultValue={this.state.card.description}/>
    </View>
  }

  scroll = () => {
    try {
      this.scrollView.scrollToLocation({sectionIndex: 4, itemIndex: 0, viewOffset: 45})
    } catch (error) {
      console.log(error)
    }
  }

  renderLines = () => {
    return this.props.lines.map((l) => <Picker.Item key={`l-${l.id}`} label={l.title || 'New Plotline'} value={l.id}/> )
  }

  toggleEditLine = () => {
    LayoutAnimation.easeInEaseOut()
    this.setState({editLine: !this.state.editLine})
  }

  changeLine = (value) => {
    let card = this.state.card
    card.lineId = parseInt(value)
    this.setState({ card })
    this.props.navigation.setParams({dirty: true})
  }

  renderLine = ({index, item}) => {
    let line = _.find(this.props.lines, {id: this.state.card.lineId})
    let color = {color: line.color}
    let picker = null
    if (this.state.editLine) {
      picker = <Picker
          selectedValue={this.state.card.lineId}
          onValueChange={this.changeLine}
        >
        { this.renderedLines }
      </Picker>
    }
    return <View>
      <TouchableOpacity onPress={this.toggleEditLine}>
        <View style={styles.fakeInputWrapper}>
          <Text style={[styles.input, color]}>{line.title || 'New Plotline'}</Text>
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
    this.setState({editScene: !this.state.editScene})
  }

  changeScene = (value) => {
    let card = this.state.card
    card.sceneId = parseInt(value)
    this.setState({ card })
    this.props.navigation.setParams({dirty: true})
  }

  renderScene = ({index, item}) => {
    let line = _.find(this.props.scenes, {id: this.state.card.sceneId})
    let picker = null
    if (this.state.editScene) {
      picker = <Picker
          selectedValue={this.state.card.sceneId}
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

  renderAttachments = () => {
    const { navigation } = this.props
    const { card } = this.state
    console.log(card.places)
    let characterLengthText = card.characters.length > 0 ? ` (${card.characters.length})` : ''
    let placeLengthText = card.places.length > 0 ? ` (${card.places.length})` : ''
    let tagLengthText = card.tags.length > 0 ? ` (${card.tags.length})` : ''
    return <View>
      <View style={styles.listItem}>
        <TouchableOpacity onPress={() => navigation.navigate('Attachments', {type: 'characters', cardId: card.id, selected: card.characters})}>
          <View style={styles.attachmentItem}>
            <Text>Characters{characterLengthText}</Text><Icon name={'angle-right'} size={25}></Icon>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.listItem}>
        <TouchableOpacity onPress={() => navigation.navigate('Attachments', {type: 'places', cardId: card.id, selected: card.places})}>
          <View style={styles.attachmentItem}>
            <Text>Places{placeLengthText}</Text><Icon name={'angle-right'} size={25}></Icon>
          </View>
        </TouchableOpacity>
      </View>
      <View style={[styles.listItem, {borderBottomWidth: 0}]}>
        <TouchableOpacity onPress={() => navigation.navigate('Attachments', {type: 'tags', cardId: card.id, selected: card.tags})}>
          <View style={styles.attachmentItem}>
            <Text>Tags{tagLengthText}</Text><Icon name={'angle-right'} size={25}></Icon>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  }

  render () {
    if (this.state.isNewCard) {
      return <ActivityIndicator/>
    } else {
      return <View style={styles.container}>
        <SectionList
          ref={(ref) => this.scrollView = ref}
          style={{paddingBottom: 300}}
          sections={[
            {data: ['title'], title: 'Title', renderItem: this.renderTitle},
            {data: ['lineId'], title: 'Line', renderItem: this.renderLine},
            {data: ['sceneId'], title: 'Scene', renderItem: this.renderScene},
            {data: ['attachments'], title: 'Attachments', renderItem: this.renderAttachments},
            {data: ['description'], title: 'Description', renderItem: this.renderDescription},
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
  listItem: AppStyles.listItem,
  attachmentItem: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
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
