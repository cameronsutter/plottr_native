import React, { Component } from 'react'
import { connect } from 'react-redux'
import { AsyncStorage, Share } from 'react-native'
import PropTypes from 'prop-types'
import { TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AppStyles from '../styles'
import ActivityView from 'react-native-activity-view'

// maybe use https://www.npmjs.com/package/react-native-simple-share

class ShareButton extends Component {
  openShare = () => {
    let message = JSON.stringify(this.props.data, null, 2)
    // let title = 'mobile.txt'
    let title = this.props.data.file.fileName
    // Share.share({message, title})
    //   .then(({action, activityType}) => console.log(something))
    //   .catch(err => console.log(err))
    // console.log(this.props.data.file.fileName)
    ActivityView.show({text: message})
    // ActivityView.show({file: this.props.data.file.fileName})
  }

  render () {
    return <TouchableOpacity onPress={this.openShare}>
      <Ionicons name='ios-share-outline' size={34} style={AppStyles.shareButton}/>
    </TouchableOpacity>
  }
}

ShareButton.propTypes = {
  data: PropTypes.object.isRequired,
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
)(ShareButton)
