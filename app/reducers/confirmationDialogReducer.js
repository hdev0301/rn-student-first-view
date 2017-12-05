import types from '../actions/types';
import immutable from 'seamless-immutable';
import {createReducer} from 'reduxsauce';

export const INITIAL_STATE = immutable({
  message: null
});

const setConfirmationDialogMessage = (state, action) =>
  state.merge({
    message: action.message
  });

const clearConfirmationDialogMessage = (state, action) =>
  state.merge({
    message: null
  });

const logout = (state, action) => INITIAL_STATE;

const ACTION_HANDLERS = {
  [types.SET_CONFIRMATION_DIALOG_MESSAGE]: setConfirmationDialogMessage,
  [types.CLEAR_CONFIRMATION_DIALOG_MESSAGE]: clearConfirmationDialogMessage,
  [types.LOGOUT]: logout
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
