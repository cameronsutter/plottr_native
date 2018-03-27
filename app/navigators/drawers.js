import React from 'react'
import { DrawerNavigator, StackNavigator } from 'react-navigation'
import RootTabs from './rootTabs'
import Drawer from '../containers/drawer'
import Ionicons from 'react-native-vector-icons/Ionicons'
import NotesContainer from '../containers/notesContainer'
import LinesContainer from '../containers/linesContainer'
import ScenesContainer from '../containers/scenesContainer'
import TagsContainer from '../containers/tagsContainer'
import CharacterCustomAttributes from '../components/characterCustomAttributes'
import PlaceCustomAttributes from '../components/placeCustomAttributes'
import ColorWheel from '../components/colorwheel'
import * as vars from '../styles/vars'

const navigationOptions = {
  headerStyle: {height: 60},
  headerTintColor: '#ff7f32',
}

const TagStack = StackNavigator(
  {
    Tags: {
      screen: TagsContainer,
    },
    ColorPicker: {
      screen: ColorWheel,
    },
  }, {
    mode: 'modal',
    navigationOptions,
  }
)

const LineStack = StackNavigator(
  {
    Plotlines: {
      screen: LinesContainer,
    },
    ColorPicker: {
      screen: ColorWheel,
    },
  }, {
    mode: 'modal',
    navigationOptions,
  }
)

export const DrawerWrapper = DrawerNavigator({
  Outline: {
    screen: RootTabs,
  },
  Plotlines: {
    screen: LineStack,
  },
  Scenes: {
    screen: ScenesContainer,
  },
  Tags: {
    screen: TagStack,
  },
  CharacterCustom: {
    screen: CharacterCustomAttributes,
  },
  PlaceCustom: {
    screen: PlaceCustomAttributes,
  },
}, {contentComponent: Drawer, contentOptions: {inactiveTintColor: vars.orange, labelStyle: {color: vars.black}}})

//use icon: ios-stats for custom attributes
