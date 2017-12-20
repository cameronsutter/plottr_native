import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import TagDetails from '../components/tagDetails'

export default class TagsContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      backIcon: null,
    }
  }

  componentWillMount () {
    Icon.getImageSource('angle-left', 30).then((source) => this.setState({ backIcon: source }))
  }

  savePlace = () => {

    this.props.navigator.pop()
  }

  _navigateToDetails(tag) {
    this.props.navigator.push({
      component: TagDetails,
      title: tag.title,
      leftButtonIcon: this.state.backIcon,
      onLeftButtonPress: () => this.props.navigator.pop(),
      rightButtonTitle: 'Save',
      onRightButtonPress: this.savePlace,
      passProps: tag,
    });
  }

  renderItem = (tag) => {
    let color = {backgroundColor: tag.color}
    return <View key={`tag-${tag.id}`} style={styles.listItem}>
      <TouchableOpacity onPress={() => this._navigateToDetails(tag)}>
        <View style={styles.touchableItem}>
          <View style={styles.contentBox}>
            <Text style={styles.touchableItemText}>{tag.title}</Text>
            <View style={[styles.colorBox, color]}></View>
          </View>
          <Icon name={'angle-right'} size={25}></Icon>
        </View>
      </TouchableOpacity>
    </View>
  }

  render () {
    return <View style={styles.container}>
      <FlatList
        data={this.props.data}
        keyExtractor={(tag) => tag.id}
        renderItem={({item}) => this.renderItem(item)}
      />
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  listItem: {
    padding: 20,
    borderColor: '#aaa',
    borderBottomWidth: 1,
  },
  touchableItem: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  touchableItemText: {
    fontSize: 16,
  },
  contentBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorBox: {
    height: 40,
    width: 48,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    marginLeft: 20,
  }
})
