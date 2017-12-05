import immutable from 'seamless-immutable';
import {createStore, applyMiddleware, compose} from 'redux';
import {autoRehydrate} from 'redux-persist';
import createLogger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import {includes} from 'lodash';
import {configurePersistors} from './persist';
import appStateMiddleware from '../middlewares/appStateMiddleware';
import rootReducer from '../reducers';
import rootSaga from '../sagas';

// silence these saga-based messages
const SAGA_LOGGING_BLACKLIST = ['EFFECT_TRIGGERED', 'EFFECT_RESOLVED', 'EFFECT_REJECTED', 'persist/REHYDRATE', 'ETA_UPDATE_COUNTER'];
// creat the logger
const logger = createLogger({
  predicate: (getState, {type}) => __DEV__ && !includes(SAGA_LOGGING_BLACKLIST, type)
});

let store;

export default async function configureStore(initialState = {}) {
  const middleware = [];
  const enhancers = [];

  const sagaMiddleware = createSagaMiddleware()
  middleware.push(sagaMiddleware);
  
  middleware.push(appStateMiddleware);

  // Don't ship these
  if (__DEV__) {
    middleware.push(logger);
  }

  enhancers.push(applyMiddleware(...middleware));

  enhancers.push(autoRehydrate());

  store = createStore(
    rootReducer,
    immutable(initialState),
    compose(...enhancers)
  );

  await configurePersistors(store);

  sagaMiddleware.run(rootSaga);
}

export const getStore = () => store;