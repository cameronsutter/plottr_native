import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  FlatList,
  LayoutAnimation,
  ScrollView,
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AppStyles from '../styles'
import CAstyles from '../styles/customAttributes'
import HeaderTitle from '../components/headerTitle'
import SaveButton from '../components/saveButton'
import * as vars from '../styles/vars'
import { reds, oranges, greens, blues, purples, grays, whites, browns } from '../styles/CSScolors'

class ColorPicker extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state
    let right = null
    if (params.dirty) {
      let func = params.handleSave ? params.handleSave : () => null
      right = <SaveButton onPress={func} />
    } else {
      right = <Text style={AppStyles.greenSaved}>Saved</Text>
    }

    return {
      headerTitle: <HeaderTitle title='Color Chooser'/>,
      headerRight: right,
    }
  }

  constructor (props) {
    super(props)
    const { color } = props.navigation.state.params
    this.state = {
      colorText: color,
      currentColor: color,
      selectedIndex: null,
    }
    this.colors = [reds, oranges, greens, blues, purples, grays, whites, browns]
    this.labels = ['Reds', 'Oranges', 'Greens', 'Blues', 'Purples', 'Grays', 'Whites', 'Browns']
  }

  handleSave = () => {
    this.props.navigation.state.params.chooseAction(this.state.currentColor)
    this.props.navigation.setParams({dirty: false})
  }

  componentWillMount () {
    this.props.navigation.setParams({handleSave: this.handleSave})
  }

  typeColor = (text) => {
    this.setState({colorText: text})
    this.props.navigation.setParams({dirty: true})
  }

  changeColor = () => {
    this.setState({currentColor: this.state.colorText})
    this.props.navigation.setParams({dirty: true})
  }

  chooseColor = (color) => {
    console.log('choose color', color)
    LayoutAnimation.easeInEaseOut()
    let colorToUse = color.toLowerCase()
    this.setState({currentColor: colorToUse, colorText: colorToUse, selectedIndex: null})
    this.props.navigation.setParams({dirty: true})
    this.scrollView.scrollTo({x: 0, y: 0, animated: true})
  }

  selectSection = (section) => {
    const ORIG_POS = 147
    let y = ORIG_POS
    let selectedSection = null
    if (this.state.selectedIndex !== section) {
      selectedSection = section
      y = ORIG_POS + (section * 67)
    }
    LayoutAnimation.easeInEaseOut()
    this.scrollView.scrollTo({x: 0, y: y, animated: true})
    this.setState({selectedIndex: selectedSection})
  }

  renderColorText = () => {
    var regex = /#?([0123456789abcdef]{6})/
    var matches = regex.exec(this.state.colorText)
    if (matches) {
      return `#${matches[1]}`
    } else {
      return this.state.colorText
    }
  }

  renderColorItem = ({item}) => {
    let color = {backgroundColor: item.toLowerCase()}
    return <View style={[styles.listItem, styles.colorItem]}>
      <TouchableOpacity onPress={() => this.chooseColor(item)}>
        <View style={[styles.touchableItem, color]}>
          <Text style={styles.titleText}>{item}</Text>
        </View>
      </TouchableOpacity>
    </View>
  }

  renderColorList = (colors) => {
    return <View style={styles.container}>
      <FlatList data={colors} renderItem={this.renderColorItem} keyExtractor={(item, index) => index} />
    </View>
  }

  renderSection = (colors, index) => {
    let arrowStyle = {color: vars.black, marginRight: 10}
    let arrow = index === this.state.selectedIndex
      ? <Ionicons name='ios-arrow-down' style={arrowStyle} size={24}></Ionicons>
      : <Ionicons name='ios-arrow-forward' style={arrowStyle} size={24}></Ionicons>
    list = index === this.state.selectedIndex ? list = this.renderColorList(colors) : null
    return <View style={{flexDirection: 'column', justifyContent: 'space-between', height: 'auto'}} key={`colorSection-${this.labels[index]}`}>
      <TouchableOpacity style={styles.sectionToggler} onPress={() => this.selectSection(index)}>
        { arrow }
        <Text style={styles.titleText}>{this.labels[index]}</Text>
      </TouchableOpacity>
      { list }
    </View>
  }

  render () {
    let colorSections = this.colors.map(this.renderSection)
    let colorText = this.renderColorText()
    let colorStyle = {backgroundColor: colorText}
    return <ScrollView ref={(ref) => this.scrollView = ref}>
      <View style={CAstyles.instructionsWrapper}>
        <Text style={CAstyles.instructionsText}>Current Color:</Text>
      </View>
      <View style={styles.inputWrapper}>
        <View style={[styles.colorShow, colorStyle]}></View>
        <TextInput
          style={styles.input}
          autoCapitalize='none'
          returnKeyType='done'
          clearButtonMode='while-editing'
          onChangeText={this.typeColor}
          onSubmitEditing={this.changeColor}
          defaultValue={this.state.currentColor}
        />
      </View>
      <View style={CAstyles.instructionsWrapper}>
        <Text style={CAstyles.instructionsText}>Choose:</Text>
      </View>
      { colorSections }
    </ScrollView>
  }
}

const styles = StyleSheet.create({
  container: AppStyles.containerView,
  listItem: AppStyles.listItem,
  touchableItem: {
    ...AppStyles.touchableItem,
  },
  titleText: AppStyles.titleText,
  sectionToggler: {
    ...AppStyles.listItem,
    ...AppStyles.touchableItem,
    justifyContent: 'flex-start',
  },
  colorItem: {
    borderBottomLeftRadius: 10,
  	borderBottomRightRadius: 0,
  	borderTopLeftRadius: 0,
  	borderTopRightRadius: 10,
    backgroundColor: vars.white,
    borderWidth: 1,
    borderColor: '#eee',
  },
  colorShow: {
    height: 50,
    width: 50,
    marginRight: 10,
    marginLeft: 5,
    backgroundColor: vars.white,
    borderWidth: 1,
    borderColor: '#eee',
  },
  inputWrapper: {
    ...CAstyles.inputWrapper,
    flexDirection: 'row',
  },
  input: {
    ...CAstyles.input,
    width: '83%',
  },
})

ColorPicker.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    state: PropTypes.shape({
      params: PropTypes.shape({
        color: PropTypes.string,
        chooseAction: PropTypes.func.isRequired,
      })
    }).isRequired,
  }).isRequired,
}

export default ColorPicker
