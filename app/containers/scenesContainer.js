import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { sceneActions } from 'pltr'
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AppStyles from '../styles'
import FakeNavHeader from '../components/fakeNavHeader'
import HeaderTitle from '../components/headerTitle'
import AddButton from '../components/addButton'
import MenuButton from '../components/menuButton'

class ScenesContainer extends Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    let { params } = navigation.state
    params = params || {}
    return {
      drawerIcon: ({ tintColor, focused }) => (
        <Ionicons name={focused ? 'ios-film' : 'ios-film-outline'}
          size={28} style={{ color: tintColor }}
        />
      ),
    }
  }

  addScene = () => {
    this.props.actions.addScene()
  }

  renderItem = (scene) => {
    return <View key={`scene-${scene.id}`} style={styles.listItem}>
      <TouchableOpacity>
        <View style={styles.touchableItem}>
          <Text style={styles.titleText}>{scene.title}</Text>
        </View>
      </TouchableOpacity>
    </View>
  }

  render () {
    const { screenProps, navigation, scenes } = this.props
    const sortedScenes = _.sortBy(scenes, 'position')
    return <View style={styles.container}>
      <FakeNavHeader
        title='Scenes'
        leftButton={<MenuButton close={screenProps.close} navigation={navigation}/>}
        rightButton={<AddButton onPress={this.addScene}/>}
      />
      <FlatList
        data={sortedScenes}
        keyExtractor={(scene) => scene.id}
        renderItem={({item}) => this.renderItem(item)}
      />
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    ...AppStyles.containerView,
    ...AppStyles.listBackground,
  },
  listItem: AppStyles.listItem,
  touchableItem: AppStyles.touchableItem,
  descriptionText: AppStyles.descriptionText,
  titleText: AppStyles.titleText,
})

ScenesContainer.propTypes = {
  navigation: PropTypes.object.isRequired,
  scenes: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  return {
    scenes: state.scenes,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(sceneActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScenesContainer)
