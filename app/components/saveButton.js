import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Button, StyleSheet, Platform } from 'react-native'
import * as vars from '../styles/vars'

export default class SaveButton extends Component {
  render () {
    return <View style={styles.container}>
      <Button
        title='Save'
        color={vars.red}
        onPress={this.props.onPress}
      />
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      android: {
        marginRight: 10,
      }
    }),
  }
})

SaveButton.propTypes = {
  onPress: PropTypes.func.isRequired,
}
