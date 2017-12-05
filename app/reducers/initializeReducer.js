import types from '../actions/types';
import immutable from 'seamless-immutable';
import {createReducer} from 'reduxsauce';

export const INITIAL_STATE = immutable({
  initialized: false
});

const initializeSuccess = (state, action) =>
  state.merge({
    initialized: true
  });

const ACTION_HANDLERS = {
  [types.INITIALIZE_SUCCESS]: initializeSuccess
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
