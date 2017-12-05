import immutable from 'seamless-immutable';
import {AsyncStorage} from 'react-native';
import {persistStore} from 'redux-persist';
import {identity} from 'lodash';
import env from '../core/env';

const transformPersistor = {
  in: state => state.asMutable ? state.asMutable({deep: true}) : state,
  out: state => {
    state.mergeDeep = identity; // eslint-disable-line no-param-reassign
    return immutable(state);
  }
};

const persistorConfig = {
  transforms: [transformPersistor],
  storage: AsyncStorage,
  whitelist: env.app.redux.persistWhitelist
};

export async function configurePersistors(store) {
  return new Promise((resolve, reject) => {
    const persistor = persistStore(store, persistorConfig, (err, restoredState) => {      
      if (err) {
        reject(err);
      } else {
        resolve({persistor, restoredState});
      }
    });
  });
}
