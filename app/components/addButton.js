import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AppStyles from '../styles'

export default class AddButton extends Component {
  render () {
    return <TouchableOpacity onPress={this.props.onPress}>
      <Ionicons name='ios-add' size={44} style={AppStyles.addButton}/>
    </TouchableOpacity>
  }
}

AddButton.propTypes = {
  onPress: PropTypes.func.isRequired,
}
