import React from 'react'
import { DrawerNavigator } from 'react-navigation'
import RootTabs from './rootTabs'
import Drawer from '../containers/drawer'
import Ionicons from 'react-native-vector-icons/Ionicons'
import NotesContainer from '../containers/notesContainer'
import LinesContainer from '../containers/linesContainer'
import ScenesContainer from '../containers/scenesContainer'
import TagsContainer from '../containers/tagsContainer'
import CharacterCustomAttributes from '../components/characterCustomAttributes'
import PlaceCustomAttributes from '../components/placeCustomAttributes'
import * as vars from '../styles/vars'

export const DrawerWrapper = DrawerNavigator({
  Outline: {
    screen: RootTabs,
  },
  Plotlines: {
    screen: LinesContainer,
  },
  Scenes: {
    screen: ScenesContainer,
  },
  Tags: {
    screen: TagsContainer,
  },
  CharacterCustom: {
    screen: CharacterCustomAttributes,
  },
  PlaceCustom: {
    screen: PlaceCustomAttributes,
  },
}, {contentComponent: Drawer, contentOptions: {inactiveTintColor: vars.orange, labelStyle: {color: vars.black}}})

//use icon: ios-stats for custom attributes
