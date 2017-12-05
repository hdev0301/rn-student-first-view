import types from '../actions/types';
import immutable from 'seamless-immutable';
import {createReducer} from 'reduxsauce';
import {values} from 'lodash';

export const INITIAL_STATE = immutable({
  feedbackData: [],
  feedbackAddData: null,
  feedbackAddSubmitting: false,
  feedbackAddErrorCode: null,
  feedbackAddErrorMessage: null
});

const addFeedbackRequest = (state, action) =>
  state.merge({
    feedbackAddSubmitting: true,
    feedbackAddErrorCode: null,
    feedbackAddErrorMessage: null
  });

const addFeedbackSuccess = (state, action) =>
  state.merge({
    feedbackAddSubmitting: false,
    feedbackAddErrorCode: null,
    feedbackAddErrorMessage: null,
    feedbackAddData: action.feedbackData
  });

const addFeedbackFailure = (state, action) =>
  state.merge({
    feedbackAddSubmitting: false,
    feedbackAddErrorCode: action.errorCode,
    feedbackAddErrorMessage: action.errors ? values(action.errors).join('. ') : action.message,
    feedbackAddData: null
  });

const logout = (state, action) => INITIAL_STATE;

const ACTION_HANDLERS = {
  [types.ADD_FEEDBACK]: addFeedbackRequest,
  [types.ADD_FEEDBACK_SUCCESS]: addFeedbackSuccess,
  [types.ADD_FEEDBACK_FAILURE]: addFeedbackFailure,
  [types.LOGOUT]: logout
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
