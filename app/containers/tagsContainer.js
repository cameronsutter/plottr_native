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
  Platform,
  Modal,
  Button,
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AppStyles from '../styles'
import FakeNavHeader from '../components/fakeNavHeader'
import HeaderTitle from '../components/headerTitle'
import AddButton from '../components/addButton'
import MenuButton from '../components/menuButton'
import prompt from 'react-native-prompt-android'
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

  constructor (props) {
    super(props)
    this.state = {openModal: false, selectedTag: null}
  }

  componentDidMount () {
    this.props.navigation.setParams({addTag: this.addTag})
  }

  rename = (tag) => {
    if (Platform.OS == 'ios') {
      AlertIOS.prompt(
        'New Tag Name:',
        `currently: ${tag.title || 'New Tag'}`,
        text => this.props.actions.editTag(tag.id, text, tag.color)
      )
    } else {
      prompt(
        `Rename ${tag.title}` ,
        null,
        [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'OK', onPress: this.finishRename }
        ],
        {
          placeholder: tag.title,
          defaultValue: tag.title,
        }
      )
    }
  }

  finishRename = (text) => {
    const tag = this.state.selectedTag
    this.props.actions.editTag(tag.id, text, tag.color)
    this.setState({openModal: false})
  }

  changeColor = (tag) => {
    let data = {
      color: tag.color,
      chooseAction: (newColor) => {
        this.props.actions.editTag(tag.id, tag.title, newColor)
      }
    }
    this.setState({openModal: false})
    this.props.navigation.navigate('ColorPicker', data)
  }

  delete = (tag) => {
    this.setState({openModal: false})
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
  }

  showActionSheet = (tag) => {
    if (Platform.OS == 'ios') {
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
              this.rename(tag)
              break
            case 1:
              this.changeColor(tag)
              break
            case 2:
              this.deleteTag(tag)
              break
            default:
              return
          }
        }
      )
    } else {
      this.setState({openModal: true, selectedTag: tag})
    }
  }

  renderModal = () => {
    const tag = this.state.selectedTag
    if (!this.state.openModal) return null
    return <Modal
      animationType="slide"
      transparent={true}
      visible={this.state.openModal}
      onRequestClose={() => this.setState({ openModal: false })}
      >
        <View style={[styles.container, styles.buttonContainer]}>
          <View style={styles.buttonView}>
            <Button
              title={`Rename ${tag.title}`}
              color="#6cace4"
              onPress={() => this.rename(tag)}>
            </Button>
          </View>
          <View style={styles.buttonView}>
            <Button
              title="Change Color"
              color="#6cace4"
              onPress={() => this.changeColor(tag)}>
            </Button>
          </View>
          <View style={styles.buttonView}>
            <Button
              title="Delete"
              color="#6cace4"
              onPress={() => this.delete(tag)}>
            </Button>
          </View>
          <View style={styles.buttonView}>
            <Button
              title="Cancel"
              color="#6cace4"
              onPress={() => this.setState({ openModal: false })}>
            </Button>
          </View>
        </View>
    </Modal>
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
      { this.renderModal() }
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
  buttonContainer: {
    justifyContent: 'center',
    padding: '3%',
    backgroundColor: vars.white,
  },
  buttonView: {
    margin: '5%',
  },
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
