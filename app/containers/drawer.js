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
  Linking,
  Image,
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import * as vars from '../styles/vars'
import DrawerStyles from '../styles/drawer'
import images from '../../images'
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

  displayHelp = () => {
    Linking.openURL('mailto:family@plottrapp.com?subject=Plottr mobile help')
  }

  displayRequest = () => {
    Linking.openURL('https://gitreports.com/issue/cameronsutter/plottr_native')
  }

  displayEmailUpdates = () => {
    Linking.openURL('http://eepurl.com/dkSg41')
  }

  displayPlottrDesktop = () => {
    Linking.openURL('https://gumroad.com/l/fgSJ/mobile')
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

  renderHelpButton = () => {
    return <TouchableOpacity onPress={this.displayHelp}>
      <View style={DrawerStyles.buttonWrapper}>
        <Ionicons name='ios-help-buoy' size={20} style={DrawerStyles.buttonIcon} />
        <Text style={DrawerStyles.buttonText}>Help</Text>
      </View>
    </TouchableOpacity>
  }

  renderFeatureButton = () => {
    return <TouchableOpacity style={styles.featureButtonWrapper} onPress={this.displayRequest}>
      <View style={DrawerStyles.buttonWrapper}>
        <Ionicons name='ios-bulb-outline' size={26} style={DrawerStyles.buttonIcon} />
        <Text style={DrawerStyles.buttonText}>Request a Feature</Text>
      </View>
    </TouchableOpacity>
  }

  renderEmailButton = () => {
    return <TouchableOpacity style={styles.featureButtonWrapper} onPress={this.displayEmailUpdates}>
      <View style={DrawerStyles.buttonWrapper}>
        <Ionicons name='ios-mail-outline' size={22} style={DrawerStyles.buttonIcon} />
        <Text style={DrawerStyles.buttonText}>Get email updates</Text>
      </View>
    </TouchableOpacity>
  }

  renderPlottrButton = () => {
    let buttonStyles = {
      ...DrawerStyles.buttonIcon,
    }
    delete buttonStyles.color
    return <TouchableOpacity style={styles.featureButtonWrapper} onPress={this.displayPlottrDesktop}>
      <View style={DrawerStyles.buttonWrapper}>
        <Image source={images.logo} resizeMode='contain' style={[buttonStyles, styles.logo]} />
        <Text style={DrawerStyles.buttonText}>Plottr Desktop</Text>
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
        <View style={styles.footerContainer}>
          {this.renderHelpButton()}
          {this.renderFeatureButton()}
          {this.renderEmailButton()}
          {this.renderPlottrButton()}
        </View>
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
  featureButtonWrapper: {
    marginTop: 15,
  },
  footerContainer: {
    marginTop: 5,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: vars.black,
  },
  logo: {
    height: 18,
    width: 18,
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
