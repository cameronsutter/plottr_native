import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { lineActions } from 'pltr'
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

class LinesContainer extends Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    let { params } = navigation.state
    params = params || {}
    return {
      drawerIcon: ({ tintColor, focused }) => (
        <Ionicons name={focused ? 'ios-options' : 'ios-options-outline'}
          size={28} style={{ color: tintColor }}
        />
      ),
    }
  }

  addLine = () => {
    this.props.actions.addLine()
  }

  renderItem = (line) => {
    return <View key={`line-${line.id}`} style={styles.listItem}>
      <TouchableOpacity>
        <View style={styles.touchableItem}>
          <Text style={[styles.titleText, {color: line.color || vars.black}]}>{line.title}</Text>
        </View>
      </TouchableOpacity>
    </View>
  }

  render () {
    const { screenProps, navigation, lines } = this.props
    const sortedLines = _.sortBy(lines, 'position')
    return <View style={styles.container}>
      <FakeNavHeader
        title='Story Lines'
        leftButton={<MenuButton navigation={navigation}/>}
        rightButton={<AddButton onPress={this.addLine}/>}
      />
      <FlatList
        data={sortedLines}
        keyExtractor={(line) => line.id}
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

LinesContainer.propTypes = {
  navigation: PropTypes.object.isRequired,
  lines: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  return {
    lines: state.lines,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(lineActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LinesContainer)
