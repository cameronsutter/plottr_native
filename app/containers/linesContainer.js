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
  TouchableOpacity,
  ActionSheetIOS,
  AlertIOS,
  Alert,
  LayoutAnimation,
} from 'react-native'
import SortableList from 'react-native-sortable-list'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AppStyles from '../styles'
import FakeNavHeader from '../components/fakeNavHeader'
import HeaderTitle from '../components/headerTitle'
import AddButton from '../components/addButton'
import MenuButton from '../components/menuButton'
import * as vars from '../styles/vars'

class LinesContainer extends Component {
  static navigationOptions = ({ navigation }) => {
    let { params } = navigation.state
    params = params || {}
    return {
      drawerIcon: ({ tintColor, focused }) => (
        <Ionicons name={focused ? 'ios-options' : 'ios-options-outline'}
          size={28} style={{ color: tintColor }}
        />
      ),
      headerLeft: <MenuButton navigation={navigation} />,
      headerTitle: <HeaderTitle title='Plotlines'/>,
      headerRight: <AddButton onPress={params.addLine ? params.addLine : () => null}/>,
    }
  }

  sortLines = (lines) => {
    const sortedLines = _.sortBy(lines, 'position')
    const data = sortedLines.reduce((obj, line, idx) => {
      obj[idx] = line
      return obj
    }, {})
    return { data, sortedLines }
  }

  setOrder = (sortedLines) => {
    this.order = sortedLines.map((l,idx) => idx)
  }

  constructor (props) {
    super(props)
    const lineData = this.sortLines(props.lines)
    this.setOrder(lineData.sortedLines)
    this.state = lineData
  }

  componentWillReceiveProps (newProps) {
    const lineData = this.sortLines(newProps.lines)
    this.setOrder(lineData.sortedLines)
    this.setState(lineData)
  }

  componentDidMount () {
    this.props.navigation.setParams({addLine: this.addLine})
  }

  addLine = () => {
    LayoutAnimation.easeInEaseOut()
    this.props.actions.addLine()
  }

  showActionSheet = (line) => {
    ActionSheetIOS.showActionSheetWithOptions({
        options: ['Rename', 'Change Color', 'Delete', 'Cancel'],
        cancelButtonIndex: 3,
        destructiveButtonIndex: 2,
        title: 'Edit Plotline',
        message: line.title || 'New Plotline',
      },
      (idx) => {
        switch (idx) {
          case 0:
            // rename
            AlertIOS.prompt(
              'New Plotline Name:',
              `currently: ${line.title || 'New Plotline'}`,
              text => this.props.actions.editLineTitle(line.id, text)
            )
            break
          case 1:
            // change color
            let data = {
              color: line.color,
              chooseAction: (newColor) => {
                this.props.actions.editLineColor(line.id, newColor)
              }
            }
            this.props.navigation.navigate('ColorPicker', data)
            break
          case 2:
            // delete
            Alert.alert(
              'Are you sure you want to delete',
              `${line.title || 'New Plotline'}?`,
              [
                {text: 'Yes', onPress: () => {
                  this.props.actions.deleteLine(line.id)
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

  saveOrder = (nextOrder) => {
    this.order = nextOrder
  }

  reorder = () => {
    const lines = this.order.map((idx, position) => {
      var line = this.state.sortedLines[idx]
      line.position = position
      return line
    })
    LayoutAnimation.easeInEaseOut()
    this.props.actions.reorderLines(lines)
  }

  renderItem = ({data, active}) => {
    let itemStyles = [styles.listItem]
    if (active) itemStyles.push(styles.activeItem)
    return <View key={`line-${data.id}`} style={itemStyles}>
      <TouchableOpacity onPress={() => this.showActionSheet(data)}>
        <View style={styles.touchableItem}>
          <Text style={[styles.titleText, {color: data.color || vars.black}]}>{data.title || 'New Plotline'}</Text>
        </View>
      </TouchableOpacity>
      <Ionicons name='ios-move' size={20} style={{ color: vars.black, paddingRight: 30 }} />
    </View>
  }

  render () {
    return <View style={styles.container}>
      <SortableList
        data={this.state.data}
        renderRow={this.renderItem}
        onReleaseRow={this.reorder}
        onChangeOrder={this.saveOrder}
        style={styles.list}
      />
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    ...AppStyles.containerView,
    ...AppStyles.listBackground,
  },
  listItem: {
    ...AppStyles.listItem,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  touchableItem: AppStyles.touchableItem,
  descriptionText: AppStyles.descriptionText,
  titleText: AppStyles.titleText,
  list: {
    height: '100%',
  },
  activeItem: {
    transform: [{
      scale: 1.1,
    }],
    shadowRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: vars.black,
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOpacity: 1,
    shadowOffset: {height: 2, width: 2},
  },
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
