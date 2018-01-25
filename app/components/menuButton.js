import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AppStyles from '../styles'


class MenuButton extends Component {

  render () {
    return <TouchableOpacity onPress={this.props.close}>
      <Ionicons name='ios-menu' size={34} style={AppStyles.shareButton}/>
    </TouchableOpacity>
  }
}

MenuButton.propTypes = {
  data: PropTypes.object.isRequired,
  close: PropTypes.func.isRequired,
}

function mapStateToProps (state) {
  return {
    data: state,
  }
}

function mapDispatchToProps (dispatch) {
  return {
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuButton)
