import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, Text } from 'react-native'
import AppStyles from '../styles'

export default class DeleteButton extends Component {
  render () {
    return <TouchableOpacity style={AppStyles.deleteButtonContainer} onPress={this.props.onPress}>
      <Text style={AppStyles.deleteButton}>Delete</Text>
    </TouchableOpacity>
  }
}

DeleteButton.propTypes = {
  onPress: PropTypes.func.isRequired,
}
