import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { DrawerItems, SafeAreaView } from 'react-navigation'
import { uiActions } from 'pltr'
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  NativeModules,
  AlertIOS,
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import * as vars from '../styles/vars'
import DrawerStyles from '../styles/drawer'
const { DocumentViewController } = NativeModules

class Drawer extends Component {
  closeFile = () => {
    DocumentViewController.closeDocument()
  }

  editStoryName = () => {
    AlertIOS.prompt(
      'New Story Name:',
      null,
      text => this.props.actions.changeStoryName(text)
    )
  }

  renderCloseButton = () => {
    return <TouchableOpacity onPress={this.closeFile}>
      <View style={DrawerStyles.buttonWrapper}>
        <Ionicons name='ios-close-outline' size={44} style={DrawerStyles.buttonIcon} />
        <Text style={DrawerStyles.buttonText}>Close file</Text>
      </View>
    </TouchableOpacity>
  }

  renderEditButton = () => {
    return <TouchableOpacity style={styles.editButtonWrapper} onPress={this.editStoryName}>
      <View style={DrawerStyles.buttonWrapper}>
        <Ionicons name='ios-quote-outline' size={26} style={DrawerStyles.buttonIcon} />
        <Text style={DrawerStyles.buttonText}>Edit Story Name</Text>
      </View>
    </TouchableOpacity>
  }

  render () {
    return <ScrollView>
      <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
        <View style={styles.headerContainer}>
          <View style={styles.storyName}><Text style={styles.nameText}>{this.props.storyName}</Text></View>
          {this.renderEditButton()}
          {this.renderCloseButton()}
        </View>
        <DrawerItems {...this.props} />
      </SafeAreaView>
    </ScrollView>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  storyName: {
    marginTop: 30,
    marginLeft: 20,
    marginBottom: 25,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: vars.black,
  },
  editButtonWrapper: {
    marginVertical: 10,
  },
})

Drawer.propTypes = {
  storyName: PropTypes.string.isRequired,
  actions: PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  return {
    storyName: state.storyName,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(uiActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Drawer)
