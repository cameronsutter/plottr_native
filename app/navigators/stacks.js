import { StackNavigator } from 'react-navigation'

import OutlineContainer from '../containers/outlineContainer'
import SceneView from '../components/sceneView'
import CardDetails from '../components/cardDetails'

import NotesContainer from '../containers/notesContainer'
import NoteDeails from '../components/noteDetails'

import CharactersContainer from '../containers/charactersContainer'
import CharacterDetails from '../components/characterDetails'

import PlacesContainer from '../containers/placesContainer'
import PlaceDetails from '../components/placeDetails'

const navigationOptions = {
  navigationOptions: {
    headerStyle: {height: 60},
    headerTintColor: '#ff7f32',
  }
}
// headerStyle: {backgroundColor: '#ff7f32'}

export const OutlineNavigator = StackNavigator({
  List: { screen: OutlineContainer },
  Scene: { screen: SceneView },
  Card: { screen: CardDetails }
}, navigationOptions)

export const NotesNavigator = StackNavigator({
  List: { screen: NotesContainer },
  Details: { screen: NoteDeails }
}, navigationOptions)

export const CharactersNavigator = StackNavigator({
  List: { screen: CharactersContainer },
  Details: { screen: CharacterDetails }
}, navigationOptions)

export const PlacesNavigator = StackNavigator({
  List: { screen: PlacesContainer },
  Details: { screen: PlaceDetails }
}, navigationOptions)


// , {navigationOptions: {headerBackTitleStyle: {backgroundColor: 'white'}, headerStyle: {backgroundColor: '#ff7f32'}}}
// , {navigationOptions: {headerBackTitleStyle: {backgroundColor: 'white'}, headerStyle: {backgroundColor: '#ff7f32'}}}
// , {navigationOptions: {headerBackTitleStyle: {backgroundColor: 'white'}, headerStyle: {backgroundColor: '#ff7f32'}}}
// , {navigationOptions: {headerBackTitleStyle: {backgroundColor: 'white'}, headerStyle: {backgroundColor: '#ff7f32'}}}
