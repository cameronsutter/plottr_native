import React from 'react'
import { TabNavigator } from 'react-navigation'
import {
  OutlineNavigator,
  NotesNavigator,
  CharactersNavigator,
  PlacesNavigator,
 } from './stacks'
 import Icon from 'react-native-vector-icons/FontAwesome'
 import Ionicons from 'react-native-vector-icons/Ionicons'

export default RootTabs = TabNavigator({
  Outline: {
    screen: OutlineNavigator,
    navigationOptions: {
      tabBarLabel: 'Outline',
      tabBarIcon: ({ tintColor, focused }) => (
        <Icon name={'bars'}
          size={26}
          style={{ color: tintColor }}
        />
      )
    }
  },
  Notes: {
    screen: NotesNavigator,
    navigationOptions: {
      tabBarLabel: 'Notes',
      tabBarIcon: ({ tintColor, focused }) => (
        <Icon name={'pencil-square'}
          size={26}
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
          size={26}
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
        <Icon name={'map'}
          size={26}
          style={{ color: tintColor }}
        />
      )
    }
  }
})
