import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { DrawerItems, SafeAreaView } from 'react-navigation'
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import * as vars from '../styles/vars'
import DrawerStyles from '../styles/drawer'
import ShareButton from '../components/shareButton'

class Drawer extends Component {
  closeFile = () => {
    LayoutAnimation.easeInEaseOut()
    this.props.screenProps.close()
  }

  renderCloseButton = () => {
    return <TouchableOpacity onPress={this.closeFile}>
      <View style={DrawerStyles.buttonWrapper}>
        <Ionicons name='ios-close-outline' size={44} style={DrawerStyles.buttonIcon} />
        <Text style={DrawerStyles.buttonText}>Close file</Text>
      </View>
    </TouchableOpacity>
  }

  render () {
    return <ScrollView>
      <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
        <View style={styles.storyName}><Text style={styles.nameText}>{this.props.storyName}</Text></View>
        <ShareButton />
        {this.renderCloseButton()}
        <View style={styles.hr}/>
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
  hr: {
    borderBottomColor: vars.black,
    borderBottomWidth: 1,
    marginVertical: 10,
  },
})

Drawer.propTypes = {
  storyName: PropTypes.string.isRequired,
}

function mapStateToProps (state) {
  return {
    storyName: state.storyName,
  }
}

function mapDispatchToProps (dispatch) {
  return {
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Drawer)
