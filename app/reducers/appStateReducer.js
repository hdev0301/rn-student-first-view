import types from '../actions/types';
import immutable from 'seamless-immutable';
import {createReducer} from 'reduxsauce';

export const INITIAL_STATE = immutable({
  currentState: null
});

const appState = (state, action) =>
  state.merge({
    currentState: action.data
  });

const ACTION_HANDLERS = {
  [types.APP_STATE]: appState
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
