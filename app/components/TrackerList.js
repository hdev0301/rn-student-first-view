import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, ListView, TouchableHighlight, TouchableOpacity} from 'react-native';
import {isEqual} from 'lodash';
import moment from 'moment-timezone';
import i18n from '../i18n/i18n.js';
import {colors} from '../themes';
import Icon from 'react-native-vector-icons/FontAwesome';
import {formatStopTime} from '../utils/stopUtils';
import TrackerListRow from './TrackerListRow'; 

import {createIconSetFromIcoMoon} from 'react-native-vector-icons';
import icoMoonConfig from '../themes/fonts/icomoon/selection.json';
const IcoMoon = createIconSetFromIcoMoon(icoMoonConfig);

import StudentStopListFooter from './StudentStopListFooter';

export default class TrackerList extends React.Component {
  static propTypes = {
    stops: PropTypes.array,
    onRowPress: PropTypes.func
  }

  constructor(props) {
    super(props);

    const rowHasChanged = (r1, r2) => r1 !== r2;
    this.ds = new ListView.DataSource({rowHasChanged});

    this.state = {
      dataSource: this.ds.cloneWithRows(props.stops || [])
    };
  }

  componentWillReceiveProps(newProps) {
    const newStops = newProps.stops;
    const oldStops = this.props.stops;

    if (!isEqual(oldStops, newStops)) {
      this.setState({
        dataSource: this.ds.cloneWithRows(newStops)
      });
    }
  }

  render() {
    const {onRowPress} = this.props;
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(stop) => <TrackerListRow stop={stop} onRowPress={onRowPress} />}
        renderFooter={() => <StudentStopListFooter />}
        enableEmptySections={true}
      />
    );
  }
}

