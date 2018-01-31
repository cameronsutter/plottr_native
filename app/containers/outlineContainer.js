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
import HeaderTitle from '../components/headerTitle'
import AddButton from '../components/addButton'
import MenuButton from '../components/menuButton'

class OutlineContainer extends Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    let { params } = navigation.state
    params = params || {}
    return {
      headerLeft: <MenuButton close={screenProps.close} navigation={navigation} />,
      headerTitle: <HeaderTitle title='Outline'/>,
      headerRight: <AddButton onPress={params.addScene ? params.addScene : () => null}/>,
    }
  }

  addScene = () => {
    this.props.navigation.navigate('AddScene', {newScene: true})
  }

  componentDidMount () {
    this.props.navigation.setParams({addScene: this.addScene})
  }

  renderItem = (scene) => {
    return <View key={`scene-${scene.id}`} style={styles.listItem}>
      <TouchableOpacity onPress={() => this.props.navigation.navigate('Scene', {scene})}>
        <View style={styles.touchableItem}>
          <Text style={styles.touchableItemText}>{scene.title}</Text>
          <Icon name={'angle-right'} size={25}></Icon>
        </View>
      </TouchableOpacity>
    </View>
  }

  render () {
    let scenes = _.orderBy(this.props.scenes, 'position')
    return <View style={styles.container}>
      <FlatList
        data={scenes}
        keyExtractor={(scene) => scene.id}
        renderItem={({item}) => this.renderItem(item)}
      />
    </View>
  }
}

const styles = StyleSheet.create({
  container: AppStyles.containerView,
  listItem: AppStyles.listItem,
  touchableItem: AppStyles.touchableItem,
  touchableItemText: {
    fontSize: 16,
    color: 'black',
  }
})

OutlineContainer.propTypes = {
  navigation: PropTypes.object.isRequired,
  cards: PropTypes.array.isRequired,
  lines: PropTypes.array.isRequired,
  scenes: PropTypes.array.isRequired,
}

function mapStateToProps (state) {
  return {
    cards: state.cards,
    lines: state.lines,
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
)(OutlineContainer)
