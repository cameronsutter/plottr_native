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

export const OutlineNavigator = StackNavigator({
  List: { screen: OutlineContainer },
  Scene: { screen: SceneView },
  Card: { screen: CardDetails }
})

export const NotesNavigator = StackNavigator({
  List: { screen: NotesContainer },
  Details: { screen: NoteDeails }
})

export const CharactersNavigator = StackNavigator({
  List: { screen: CharactersContainer },
  Details: { screen: CharacterDetails }
})

export const PlacesNavigator = StackNavigator({
  List: { screen: PlacesContainer },
  Details: { screen: PlaceDetails }
})
