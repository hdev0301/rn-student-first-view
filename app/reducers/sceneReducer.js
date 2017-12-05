import immutable from 'seamless-immutable';
import {createReducer} from 'reduxsauce';
import {ActionConst as NavActionConst} from 'react-native-router-flux';

export const INITIAL_STATE = immutable({
  sceneData: {}
});

const sceneFocusChange = (state, action) =>
  state.merge({
    sceneData: action.scene
  });

const ACTION_HANDLERS = {
  [NavActionConst.FOCUS]: sceneFocusChange
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
