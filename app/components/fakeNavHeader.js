import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Text,
  View,
} from 'react-native'
import FakeNavStyles from '../styles/fakeNav'
import HeaderTitle from '../components/headerTitle'

class FakeNavHeader extends Component {

  render () {
    return <View style={FakeNavStyles.headerBackground}>
      <View style={FakeNavStyles.header}>
        {this.props.leftButton}
        <HeaderTitle title={this.props.title}/>
        {this.props.rightButton}
      </View>
    </View>
  }
}

FakeNavHeader.propTypes = {
  leftButton: PropTypes.object,
  rightButton: PropTypes.object,
  title: PropTypes.string.isRequired,
}

export default FakeNavHeader
