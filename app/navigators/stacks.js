import { StackNavigator } from 'react-navigation'

import OutlineContainer from '../containers/outlineContainer'
import SceneView from '../components/sceneView'
import CardDetails from '../components/cardDetails'
import SceneDetails from '../components/sceneDetails'
import AttachmentsSelector from '../components/attachmentsSelector'

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
  Outline: { screen: OutlineContainer },
  Scene: { screen: SceneView },
  Card: { screen: CardDetails },
  AddScene: { screen: SceneDetails },
  Attachments: { screen: AttachmentsSelector },
}, navigationOptions)

export const NotesNavigator = StackNavigator({
  Notes: { screen: NotesContainer },
  NoteDetails: { screen: NoteDeails },
  Attachments: { screen: AttachmentsSelector },
}, navigationOptions)

export const CharactersNavigator = StackNavigator({
  Characters: { screen: CharactersContainer },
  CharacterDetails: { screen: CharacterDetails }
}, navigationOptions)

export const PlacesNavigator = StackNavigator({
  Places: { screen: PlacesContainer },
  PlaceDetails: { screen: PlaceDetails }
}, navigationOptions)


// , {navigationOptions: {headerBackTitleStyle: {backgroundColor: 'white'}, headerStyle: {backgroundColor: '#ff7f32'}}}
// , {navigationOptions: {headerBackTitleStyle: {backgroundColor: 'white'}, headerStyle: {backgroundColor: '#ff7f32'}}}
// , {navigationOptions: {headerBackTitleStyle: {backgroundColor: 'white'}, headerStyle: {backgroundColor: '#ff7f32'}}}
// , {navigationOptions: {headerBackTitleStyle: {backgroundColor: 'white'}, headerStyle: {backgroundColor: '#ff7f32'}}}
