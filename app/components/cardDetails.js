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
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import AppStyles from '../styles'
import HeaderTitle from './headerTitle'

class CardDetails extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state
    let right = null
    if (params.dirty) {
      right = <Button
        title='Save'
        color='#e5554f'
        onPress={params.handleSave ? params.handleSave : () => null}
      />
    } else {
      right = <Text style={styles.green}>Saved</Text>
    }
    return {
      headerTitle: <HeaderTitle title='Card Details'/>,
      headerRight: right,
    }
  }

  constructor(props) {
    const { card } = props.navigation.state.params
    super(props)
    this.renderedLines = this.renderLines()
    this.renderedScenes = this.renderScenes()
    this.state = {
      title: card.title,
      description: card.description,
      lineId: card.lineId,
      sceneId: card.sceneId,
      editLine: false,
      editScene: false,
    }
  }

  handleSave = () => {
    const { card } = this.props.navigation.state.params
    this.props.actions.editCard(card.id, this.state.title, this.state.description)
    this.props.navigation.setParams({dirty: false})
    LayoutAnimation.easeInEaseOut()
    this.setState({editLine: false, editScene: false})
  }

  componentWillMount () {
    this.props.navigation.setParams({handleSave: this.handleSave})
  }

  titleChanged = (text) => {
    this.props.navigation.setParams({dirty: true})
    this.setState({title: text})
  }

  descriptionChanged = (text) => {
    this.props.navigation.setParams({dirty: true})
    this.setState({description: text})
  }

  renderTitle = ({index, item}) => {
    return <View style={styles.inputWrapper}>
      <TextInput onChangeText={this.titleChanged} style={styles.input} multiline={true} defaultValue={item}/>
    </View>
  }

  renderDescription = ({index, item}) => {
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
    const { card } = this.props.navigation.state.params
    return <View style={styles.container}>
      <SectionList
        sections={[
          {data: [card.title || ''], title: 'Title', renderItem: this.renderTitle},
          {data: ['lineId'], title: 'Line', renderItem: this.renderLine},
          {data: ['sceneId'], title: 'Scene', renderItem: this.renderScene},
          {data: [card.description || ''], title: 'Description', renderItem: this.renderDescription},
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
        card: PropTypes.object.isRequired,
      })
    }).isRequired,
  }).isRequired,
  lines: PropTypes.array.isRequired,
  scenes: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  return {
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
