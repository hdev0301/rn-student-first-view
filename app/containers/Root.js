import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {View} from 'react-native';
import Fabric from 'react-native-fabric';
import {Router, Actions as NavActions, ActionConst as NavActionConst} from 'react-native-router-flux';
import {includes} from 'lodash';
import actions from '../actions/creators';
import scenes from '../navigation/scenes';
const {Answers} = Fabric;

import styles from './styles/rootStyle';

const RouterWithRedux = connect()(Router);

class Root extends Component {
  static propTypes = {
    scene: PropTypes.object.isRequired,
    initialized: PropTypes.bool.isRequired,
    hasSeenWalkthrough: PropTypes.bool.isRequired,
    initialize: PropTypes.func.isRequired,
    registerPush: PropTypes.func.isRequired,
    subscribeToOneSignal: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.props.initialize();
  }

  componentWillReceiveProps(newProps) {
    const {scene: {sceneKey}, authToken, initialized, hasSeenWalkthrough, pushId, registerPush, subscribeToOneSignal} = newProps;
    const {authToken: oldAuthToken, pushId: oldPushId, scene: {sceneKey: oldSceneKey}} = this.props;
    if (initialized) {
      if (
        !!authToken && !!pushId &&
        (
          sceneKey === 'startup' ||
          oldAuthToken !== authToken ||
          oldPushId !== pushId
        )
      ) {
        registerPush(pushId);
      }

      if (oldSceneKey === 'login' && includes(['tracker', 'walkthrough'], sceneKey) && !!pushId) {
        subscribeToOneSignal();
      }

      if (sceneKey === 'startup' || oldAuthToken !== authToken) {

        Answers.logLogin('App login', true);

        if (!authToken) {
          NavActions.login({type: NavActionConst.REPLACE});
        } else {
          if (!hasSeenWalkthrough) {
            NavActions.walkthrough({type: NavActionConst.REPLACE});
          } else {
            NavActions.tracker({type: NavActionConst.REPLACE});
          }
        }
      }
    }
  }

  render() {
    return (
      <RouterWithRedux sceneStyle={styles.scene} scenes={scenes} />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authToken: state.login.authToken,
    initialized: state.initialize.initialized,
    pushId: state.oneSignal.pushId,
    scene: state.scene.sceneData,
    hasSeenWalkthrough: state.walkthroughPersistent.hasSeenWalkthrough
  };
};

const mapDispatchToProps = dispatch => ({
  initialize: () => dispatch(actions.initialize()),
  registerPush: pushId => dispatch(actions.registerPush(pushId)),
  subscribeToOneSignal: () => dispatch(actions.subscribeToOneSignal())
});

export default connect(mapStateToProps, mapDispatchToProps)(Root);
