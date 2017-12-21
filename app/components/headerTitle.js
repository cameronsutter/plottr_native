import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Text } from 'react-native'
import AppStyles from '../styles'

export default class HeaderTitle extends Component {
  render () {
    return <Text style={AppStyles.headerTitle}>{this.props.title}</Text>
  }
}

HeaderTitle.propTypes = {
  title: PropTypes.string.isRequired,
}
