import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  AsyncStorage,
  Share,
  TouchableOpacity,
  View,
  Text,
} from 'react-native'
import PropTypes from 'prop-types'
import Ionicons from 'react-native-vector-icons/Ionicons'
import DrawerStyles from '../styles/drawer'
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
    let exclude = [
      'addToReadingList',
      'assignToContact',
      'openInIBooks',
      'postToFacebook',
      'postToTwitter',
      'saveToCameraRoll',
      'markupAsPDF',
    ]
    ActivityView.show({text: message, exclude})
    // ActivityView.show({file: this.props.data.file.fileName})
  }

  render () {
    return <TouchableOpacity onPress={this.openShare}>
      <View style={DrawerStyles.buttonWrapper}>
        <Ionicons name='ios-share-outline' size={34} style={DrawerStyles.buttonIcon}/>
        <Text style={DrawerStyles.buttonText}>Share</Text>
      </View>
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
