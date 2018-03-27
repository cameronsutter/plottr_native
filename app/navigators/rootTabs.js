import React from 'react'
import { TabNavigator } from 'react-navigation'
import {
  OutlineNavigator,
  NotesNavigator,
  CharactersNavigator,
  PlacesNavigator,
} from './stacks'
import {
  OutlineDrawer,
} from './drawers'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default RootTabs = TabNavigator({
  Outline: {
    screen: OutlineNavigator,
    navigationOptions: {
      tabBarLabel: 'Outline',
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons name={focused ? 'ios-list-box' : 'ios-list-box-outline'}
          size={28} style={{ color: tintColor }}
        />
      ),
      drawerIcon: ({ tintColor, focused }) => (
        <Ionicons name={focused ? 'ios-list-box' : 'ios-list-box-outline'}
          size={28} style={{ color: tintColor }}
        />
      ),
    }
  },
  Notes: {
    screen: NotesNavigator,
    navigationOptions: {
      tabBarLabel: 'Notes',
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons name={focused ? 'ios-create' : 'ios-create-outline'}
          size={28}
          style={{ color: tintColor }}
        />
      )
    }
  },
  Characters: {
    screen: CharactersNavigator,
    navigationOptions: {
      tabBarLabel: 'Characters',
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons name={focused ? 'ios-people' : 'ios-people-outline'}
          size={28}
          style={{ color: tintColor }}
        />
      )
    }
  },
  Places: {
    screen: PlacesNavigator,
    navigationOptions: {
      tabBarLabel: 'Places',
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons name={focused ? 'ios-planet' : 'ios-planet-outline'}
          size={28}
          style={{ color: tintColor }}
        />
      )
    }
  }
}, {tabBarOptions: {activeTintColor: '#ff7f32'}})
