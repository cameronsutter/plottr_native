import React from 'react'
import { DrawerNavigator } from 'react-navigation'
import RootTabs from './rootTabs'
import Drawer from '../containers/drawer'
import Ionicons from 'react-native-vector-icons/Ionicons'
import NotesContainer from '../containers/notesContainer'
import LinesContainer from '../containers/linesContainer'
import ScenesContainer from '../containers/scenesContainer'
import TagsContainer from '../containers/tagsContainer'

export const DrawerWrapper = DrawerNavigator({
  Outline: {
    screen: RootTabs,
  },
  Lines: {
    screen: LinesContainer,
  },
  Scenes: {
    screen: ScenesContainer,
  },
  Tags: {
    screen: TagsContainer,
  },
}, {contentComponent: Drawer})

//use icon: ios-stats for custom attributes
