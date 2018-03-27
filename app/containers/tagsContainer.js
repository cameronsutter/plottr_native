import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { tagActions } from 'pltr'
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActionSheetIOS,
  AlertIOS,
  Alert,
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AppStyles from '../styles'
import FakeNavHeader from '../components/fakeNavHeader'
import HeaderTitle from '../components/headerTitle'
import AddButton from '../components/addButton'
import MenuButton from '../components/menuButton'
import * as vars from '../styles/vars'

class ScenesContainer extends Component {
  static navigationOptions = ({ navigation }) => {
    let { params } = navigation.state
    params = params || {}
    return {
      drawerIcon: ({ tintColor, focused }) => (
        <Ionicons name={focused ? 'ios-pricetag' : 'ios-pricetag-outline'}
          size={28} style={{ color: tintColor }}
        />
      ),
      headerLeft: <MenuButton navigation={navigation} />,
      headerTitle: <HeaderTitle title='Tags'/>,
      headerRight: <AddButton onPress={params.addTag ? params.addTag : () => null}/>,
    }
  }

  addTag = () => {
    this.props.actions.addTag()
  }

  componentDidMount () {
    this.props.navigation.setParams({addTag: this.addTag})
  }

  showActionSheet = (tag) => {
    ActionSheetIOS.showActionSheetWithOptions({
        options: ['Rename', 'Change Color', 'Delete', 'Cancel'],
        cancelButtonIndex: 3,
        destructiveButtonIndex: 2,
        title: 'Edit Tag',
        message: tag.title || 'New Tag',
      },
      (idx) => {
        switch (idx) {
          case 0:
            // rename
            AlertIOS.prompt(
              'New Tag Name:',
              `currently: ${tag.title || 'New Tag'}`,
              text => this.props.actions.editTag(tag.id, text, tag.color)
            )
            break
          case 1:
            let data = {
              color: tag.color,
              chooseAction: (newColor) => {
                console.log(newColor)
                console.log(tag.id)
                console.log(tag.title)
                this.props.actions.editTag(tag.id, tag.title, newColor)
              }
            }
            this.props.navigation.navigate('ColorPicker', data)
            break
          case 2:
            // delete
            Alert.alert(
              'Are you sure you want to delete',
              `${tag.title || 'New Tag'}?`,
              [
                {text: 'Yes', onPress: () => {
                  this.props.actions.deleteTag(tag.id)
                }},
                {text: 'No', onPress: () => {}, style: 'cancel'},
              ]
            )
            break
          default:
            return
        }
      }
    )
  }

  renderItem = (tag) => {
    return <View key={`tag-${tag.id}`} style={styles.listItem}>
      <TouchableOpacity onPress={() => this.showActionSheet(tag)}>
        <View style={styles.touchableItem}>
          <Text style={[styles.titleText, {color: tag.color || vars.black}]}>{tag.title || 'New Tag'}</Text>
        </View>
      </TouchableOpacity>
    </View>
  }

  render () {
    const { navigation, tags } = this.props
    const sortedTags = _.sortBy(tags, 'title')
    return <View style={styles.container}>
      <FlatList
        data={sortedTags}
        keyExtractor={(tag) => tag.id}
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
  tags: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  return {
    tags: state.tags,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(tagActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScenesContainer)
