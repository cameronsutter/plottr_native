import { createStore, applyMiddleware, combineReduxers, compose } from 'redux'
import { createLogger } from 'redux-logger'
import { rootReducer } from 'pltr'
import saver from '../middlewares/saver'
import tracker from '../middlewares/tracker'

const loggerMiddleware = createLogger({ predicate: (getState, action) => __DEV__})

export default function configureStore(initialState) {
  const enhancer = compose(
    applyMiddleware(saver, tracker, loggerMiddleware)
  )
  return createStore(rootReducer, initialState, enhancer)
}
