import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  Text,
  View,
} from 'react-native'
import AppStyles from '../styles'
import HeaderTitle from '../components/headerTitle'
import SaveButton from '../components/saveButton'
import { ColorPicker, fromHsv, toHsv } from 'react-native-color-picker'

class ColorWheel extends Component {
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
      color: toHsv(color),
      oldColor: color,
    }
  }

  handleSave = () => {
    let cssColor = fromHsv(this.state.color)
    this.props.navigation.state.params.chooseAction(cssColor)
    this.props.navigation.setParams({dirty: false})
  }

  componentWillMount () {
    this.props.navigation.setParams({handleSave: this.handleSave})
  }

  changeColor = (color) => {
    this.setState({ color })
    if (!this.props.navigation.state.params.dirty) {
      this.props.navigation.setParams({dirty: true})
    }
  }

  render () {
    return <View style={styles.container}>
      <ColorPicker
        color={this.state.color}
        oldColor={this.state.oldColor}
        onColorChange={this.changeColor}
        style={{flex: 1, paddingBottom: 50, paddingHorizontal: 2}}
      />
    </View>
  }
}

const styles = StyleSheet.create({
  container: AppStyles.containerView,
})

ColorWheel.propTypes = {
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

export default ColorWheel
