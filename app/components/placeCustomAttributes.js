import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { customAttributeActions } from 'pltr'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AppStyles from '../styles'
import CAstyles from '../styles/customAttributes'
import * as vars from '../styles/vars'
import FakeNavHeader from '../components/fakeNavHeader'
import HeaderTitle from '../components/headerTitle'
import AddButton from '../components/addButton'
import MenuButton from '../components/menuButton'

class PlaceCustomAttributes extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      drawerLabel: 'Place Custom Attributes',
      drawerIcon: ({ tintColor, focused }) => (
        <Ionicons name={focused ? 'ios-partly-sunny' : 'ios-partly-sunny-outline'}
          size={26} style={{ color: tintColor }}
        />
      ),
    }
  }

  state = {
    text: null
  }

  addAttribute = () => {
    if (this.state.text) {
      this.props.actions.addPlaceAttr(this.state.text.trim())
    }
    this.setState({text: null})
  }

  deleteAttribute = (attribute) => {
    Alert.alert(
      'Are you sure you want to delete',
      `${attribute}?`,
      [
        {text: 'Yes', onPress: () => {
          this.props.actions.removePlaceAttr(attribute)
        }},
        {text: 'No', onPress: () => {}, style: 'cancel'},
      ]
    )
  }

  renderItem = ({item, index}) => {
    return <View key={`attr-${index}`} style={[styles.listItem, CAstyles.itemContainer]}>
      <View style={styles.touchableItem}>
        <Text style={styles.titleText}>{item}</Text>
      </View>
      <View>
        <TouchableOpacity onPress={() => this.deleteAttribute(item)}>
          <Ionicons name='ios-trash' size={32} style={{ color: vars.red, paddingRight: 30 }}/>
        </TouchableOpacity>
      </View>
    </View>
  }

  render () {
    const { navigation, attributes } = this.props
    return <View style={styles.container}>
      <FakeNavHeader
        title='Place Attributes'
        leftButton={<MenuButton navigation={navigation}/>}
        rightButton={<View/>}
      />
      <View style={CAstyles.instructionsWrapper}>
        <Text style={CAstyles.instructionsText}>Add a New Attribute:</Text>
      </View>
      <View style={CAstyles.inputWrapper}>
        <TextInput
          style={CAstyles.input}
          autoCapitalize='none'
          returnKeyType='done'
          clearButtonMode='while-editing'
          onChangeText={(text) => this.setState({text})}
          onSubmitEditing={this.addAttribute}
          value={this.state.text}
        />
      </View>
      <View style={CAstyles.instructionsWrapper}>
        <Text style={CAstyles.instructionsText}>Current Attributes:</Text>
      </View>
      <FlatList
        data={attributes}
        keyExtractor={(attr, idx) => idx}
        renderItem={this.renderItem}
        emptyListComponent={<View><Text>No Custom Attributes</Text></View>}
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

PlaceCustomAttributes.propTypes = {
  navigation: PropTypes.object.isRequired,
  attributes: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  return {
    attributes: state.customAttributes['places'],
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(customAttributeActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlaceCustomAttributes)
