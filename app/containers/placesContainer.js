import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { placeActions } from 'pltr'
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import AppStyles from '../styles'
import HeaderTitle from '../components/headerTitle'
import AddButton from '../components/addButton'
import MenuButton from '../components/menuButton'

class PlacesContainer extends Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    let { params } = navigation.state
    params = params || {}
    return {
      headerLeft: <MenuButton close={screenProps.close} />,
      headerTitle: <HeaderTitle title='Places'/>,
      headerRight: <AddButton onPress={params.addPlace ? params.addPlace : () => null} />,
    }
  }

  addPlace = () => {
    this.props.navigation.navigate('Details', {newPlace: true})
  }

  componentDidMount () {
    this.props.navigation.setParams({addPlace: this.addPlace})
  }

  renderItem = (place) => {
    return <View key={`place-${place.id}`} style={styles.listItem}>
      <TouchableOpacity onPress={() => this.props.navigation.navigate('Details', {place})}>
        <View style={styles.touchableItem}>
          <View>
            <Text style={styles.titleText}>{place.name}</Text>
            <Text style={styles.descriptionText}>{place.description}</Text>
          </View>
          <Icon name={'angle-right'} size={25}></Icon>
        </View>
      </TouchableOpacity>
    </View>
  }

  render () {
    return <View style={styles.container}>
      <FlatList
        data={this.props.places}
        keyExtractor={(place) => place.id}
        renderItem={({item}) => this.renderItem(item)}
      />
    </View>
  }
}

const styles = StyleSheet.create({
  container: AppStyles.containerView,
  listItem: AppStyles.listItem,
  touchableItem: AppStyles.touchableItem,
  descriptionText: AppStyles.descriptionText,
  titleText: AppStyles.titleText,
})

PlacesContainer.propTypes = {
  navigation: PropTypes.object.isRequired,
  places: PropTypes.array.isRequired,
}

function mapStateToProps (state) {
  return {
    places: state.places,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(placeActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlacesContainer)
