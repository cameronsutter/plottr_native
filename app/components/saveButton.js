import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-native'
import * as vars from '../styles/vars'

export default class SaveButton extends Component {
  render () {
    return <Button
      title='Save'
      color={vars.red}
      onPress={this.props.onPress}
    />
  }
}

SaveButton.propTypes = {
  onPress: PropTypes.func.isRequired,
}
