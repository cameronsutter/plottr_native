import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { sceneActions } from 'pltr'
import {
  Text,
  TextInput,
  View,
  SectionList,
  ActivityIndicator,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import styles from '../styles'
import HeaderTitle from './headerTitle'
import SaveButton from './saveButton'

class SceneDetails extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state
    let right = null
    if (params.newScene) {
      right = <ActivityIndicator/>
    } else if (params.dirty) {
      let func = params.handleSave ? params.handleSave : () => null
      right = <SaveButton onPress={func}/>
    } else {
      right = <Text style={styles.greenSaved}>Saved</Text>
    }
    return {
      headerTitle: <HeaderTitle title='Scene Details'/>,
      headerRight: right,
    }
  }

  constructor(props) {
    super(props)
    const { params } = props.navigation.state
    if (params.newScene) {
      this.state = {
        newScene: true,
      }
    } else {
      this.state = {
        newScene: false,
        scene: params.scene,
      }
    }
    this.title = ''
  }

  componentWillMount () {
    this.props.navigation.setParams({handleSave: this.handleSave})
    if (this.state.newScene) {
      this.props.actions.addScene()
      setTimeout(this.findNewScene, 500)
    }
  }

  findNewScene = () => {
    let scene = this.props.scenes[0]
    if (scene.title == 'New Scene') {
      let title = `Scene ${scene.position + 1}`
      this.title = title // this is so the sectionList always has a title to render
      scene.title = title
      this.setState({newScene: false, scene})
      this.props.navigation.setParams({newScene: false, dirty: true})
    }
  }

  handleSave = () => {
    const { scene } = this.state
    this.props.actions.editSceneTitle(scene.id, scene.title)
    this.props.navigation.setParams({dirty: false})
  }

  titleChanged = (text) => {
    this.props.navigation.setParams({dirty: true})
    let scene = this.state.scene
    scene.title = text
    this.setState({scene})
  }

  renderTitle = ({item}) => {
    return <View style={styles.inputWrapper}>
      <TextInput onChangeText={this.titleChanged} style={styles.input}
        defaultValue={item} clearButtonMode='while-editing'/>
    </View>
  }

  render () {
    if (this.state.scene) {
      return <View style={styles.detailsView}>
        <SectionList
          sections={[
            {data: [this.title], title: 'Title', renderItem: this.renderTitle},
          ]}
          renderSectionHeader={({section}) => <View style={styles.sectionHeader}><Text style={styles.sectionHeaderText}>{section.title}</Text></View>}
          keyExtractor={(item, index) => `${item.substring(0, 3)}-${index}`}
        />
      </View>
    } else {
      return <ActivityIndicator />
    }
  }
}

// const styles = StyleSheet.create({
//   container: AppStyles.detailsView,
//   sectionHeader: AppStyles.sectionHeader,
//   sectionHeaderText: AppStyles.sectionHeaderText,
//   input: AppStyles.input,
//   green: AppStyles.greenSaved,
//   inputWrapper: AppStyles.inputWrapper,
// })

SceneDetails.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    state: PropTypes.shape({
      params: PropTypes.shape({
        scene: PropTypes.object,
      })
    }).isRequired,
  }).isRequired,
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
)(SceneDetails)
