import { createStore, applyMiddleware, combineReduxers, compose } from 'redux'
import { createLogger } from 'redux-logger'
import { rootReducer } from 'pltr'

const loggerMiddleware = createLogger({ predicate: (getState, action) => __DEV__})

export default function configureStore(initialState) {
  const enhancer = compose(
    applyMiddleware(loggerMiddleware)
  )
  return createStore(rootReducer, initialState, enhancer)
}
