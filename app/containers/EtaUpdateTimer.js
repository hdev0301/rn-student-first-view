import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text} from 'react-native';
import Svg, {Circle} from 'react-native-svg';
import {isNull, map, split, trim} from 'lodash';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import i18n from '../i18n/i18n.js';
import {colors} from '../themes/';
import env from '../core/env';
import styles from './styles/etaUpdateTimerStyle';

class EtaUpdateTimer extends Component {

  static propTypes = {
    stopsError: PropTypes.bool.isRequired,
    etaRefreshError: PropTypes.bool.isRequired,
    etaUpdateCounter: PropTypes.number
  };

  renderProgressIcon = () => {
    const {etaUpdateCounter} = this.props;
    
    return (
      <Svg width="30" height="30">
        <Circle
          cx="15"
          cy="15"
          r={10}
          fill={etaUpdateCounter ? colors.grey : colors.darkGreen}
        />
        <Circle
          cx="15"
          cy="15"
          r={10 * etaUpdateCounter / env.app.etaRefreshInterval}
          fill={colors.red}
        />
      </Svg>
    )
  }

  render() {
    const {etaUpdateCounter, stopsError, etaRefreshError} = this.props;
    if (stopsError || etaRefreshError) {
      const message = i18n.t('etaUpdateTimer-updateErrorText');
      return (
        <View style={styles.etaUpdateTimerContainer}>
          <View style={styles.timerErrorContainer}>
            {map(split(message, '<br>'), (item, index) => <Text key={index} style={styles.timerErrorText}>{trim(item)}</Text>)}
          </View>
        </View>
      );
    } else if (!isNull(etaUpdateCounter)) {
      const message = etaUpdateCounter ? i18n.t('etaUpdateTimer-timeIn').replace('{0}', Math.ceil(etaUpdateCounter)): i18n.t('etaUpdateTimer-timeNow');
      return (
        <View style={styles.etaUpdateTimerContainer}>
          <View>
            {map(split(message, '<br>'), (item, index) => <Text key={index} style={styles.timerText}>{trim(item)}</Text>)}
          </View>
          <View style={styles.progressIconContainer}>{this.renderProgressIcon()}</View>
        </View>
      );
    }
    return <View />;
  }
}

const mapStateToProps = (state) => {
  return {
    stopsError: state.tracker.stopsError,
    etaRefreshError: state.tracker.etaRefreshError,
    etaUpdateCounter: state.tracker.etaUpdateCounter
  };
};

export default connect(mapStateToProps)(EtaUpdateTimer);