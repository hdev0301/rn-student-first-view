import types from '../actions/types';
import immutable from 'seamless-immutable';
import {createReducer} from 'reduxsauce';

export const INITIAL_STATE = immutable({
  hasSeenWalkthrough: false
});

const setHasSeenWalkthrough = (state, action) =>
  state.merge({
    hasSeenWalkthrough: true
  });

const logout = (state, action) => INITIAL_STATE;

const ACTION_HANDLERS = {
  [types.SET_HAS_SEEN_WALKTHROUGH]: setHasSeenWalkthrough,
  [types.LOGOUT]: logout
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
