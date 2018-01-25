import { newFileState } from 'pltr'

export function newFileData () {
  return {
    cards: newFileState.newFileCards,
    characters: newFileState.newFileCharacters,
    customAttributes: newFileState.newFileCustomAttributes,
    file: newFileState.newFileFile,
    lines: newFileState.newFileLines,
    notes: newFileState.newFileNotes,
    places: newFileState.newFilePlaces,
    scenes: newFileState.newFileScenes,
    storyName: newFileState.newFileStoryName,
    tags: newFileState.newFileTags,
    ui: newFileState.newFileUI,
  }
}
