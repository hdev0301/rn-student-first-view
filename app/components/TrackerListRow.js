import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, ListView, TouchableHighlight, TouchableOpacity} from 'react-native';
import {map, split, trim, get, includes} from 'lodash';
import moment from 'moment-timezone';
import RNApptentive from 'react-native-apptentive';
import i18n from '../i18n/i18n.js';
import {colors} from '../themes';
import Icon from 'react-native-vector-icons/FontAwesome';
import {formatStopTime} from '../utils/stopUtils';

import {createIconSetFromIcoMoon} from 'react-native-vector-icons';
import icoMoonConfig from '../themes/fonts/icomoon/selection.json';
const IcoMoon = createIconSetFromIcoMoon(icoMoonConfig);

import StudentStopListFooter from './StudentStopListFooter';

import styles from './styles/trackerListRowStyle';

export default class TrackerListRow extends React.Component {
  static propTypes = {
    stop: PropTypes.object.isRequired,
    onRowPress: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      showInfoText: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const {infoText} = this.getMinutesBlockData(nextProps);
    if (!infoText) {
      this.setState({showInfoText: false});
    }
    const {isMounted, height, rowHeight} = this.state;
    if (isMounted && height !== null && rowHeight !== null) {
      if (newProps.remove) {
        this.onRemoving(newProps.onRowRemoveCallback);
      } else {
        this.onReset();
      }
    }
  }

  handleRowPress = (stop, isSeeMap) => {
    const {onRowPress} = this.props;
    if (onRowPress) {
      onRowPress(stop, isSeeMap);
    }
  }

  handleInfoPress = () => {
    this.setState({showInfoText: !this.state.showInfoText});
    RNApptentive.engage('info_button_tapped');
  }

  getMinutesBlockData = (props) => {
    const {stop: {color, type, minutes, vehicle, shouldShowBus}} = props;
    const hasLocation = get(vehicle, 'latitude', false) && get(vehicle, 'longitude', false) && get(vehicle, 'direction', false);

    const iconCmp = (name) => <IcoMoon name={name} size={32} color={color} style={styles.listRowMinutesIcon}/>;

    let label = null;
    let icon = null;
    let infoText = null;

    if (!hasLocation && includes(['scheduled', 'estimated'], type)) {
      // Don't show 'no gps' unless the service is within visibility window
      if (shouldShowBus) {
        icon = iconCmp('no-gps-icon');
        label = i18n.t('noGps');
        infoText = i18n.t('trackerListRow-noGpsInfoText');
      }
    } else if (type === 'scheduled' && shouldShowBus) { // no ETA data, but may have location
      icon = iconCmp('stop-visited');
      label = i18n.t('seeMap');
      infoText = i18n.t('trackerListRow-seeMapInfoText');
    } else if (type === 'estimated') { // have an ETA
      if (minutes !== null) {
        switch (minutes) {
          case 1:
            label = i18n.t('min');
            break;
          case 0:
            label = i18n.t('due')
            break;
          default:
            label = i18n.t('mins');
        }
        icon = <Text style={styles.listRowMinutes}>{minutes}</Text>;
      } else if (hasLocation && shouldShowBus) { // estimated, but no ETA minutes data available
        icon = iconCmp('stop-visited');
        label = i18n.t('seeMap');
        infoText = i18n.t('trackerListRow-seeMapInfoText');
      }
    } else if (includes(['arrived'], type)) { // stop is completed
      icon = iconCmp(`stop-${type}`);
      label = i18n.t(`iconLabel-${type}`);
    } else if (includes(['visited'], type)) { // stop is passed, no GPS reading at the stop
      icon = iconCmp('stop-visited');
      label = i18n.t('seeMap');
      infoText = i18n.t('trackerListRow-seeMapInfoText');
    }

    return {
      label,
      icon,
      infoText
    }
  }

  renderDebug() {
    const {stop: {busStatus, busCompleteStatus, shouldShowBus, serviceStartTime}}= this.props;
    return (
      <View>
        <Text>Service Start: {(serviceStartTime) ? moment(serviceStartTime).format('HH:mm') : 'none yet'}</Text>
        <Text> </Text>
        <Text>Start {busStatus}m</Text>
        <Text>End {busCompleteStatus}m</Text>
        <Text>Show 🚌? {shouldShowBus ? 'T' : 'F'}</Text>
      </View>
    );
  }

  renderStopInfo() {
    const {stop: {customName, stopName, color}} = this.props;
    let name = customName || stopName;
    let address = customName ? stopName : '';
    return (
      <View style={styles.listRowDetailsStopInfoContainer}>
        <View style={styles.listRowDetailsStopInfoBorderContainer}><Text> </Text></View>
        <View style={styles.listRowDetailsStopInfoValueContainer}>
          <IcoMoon name={'stop-pin'} size={14} color={color}/>
          <Text style={styles.listRowDetailsStopInfoValue} numberOfLines={1}>{name}</Text>
        </View>
        <View style={styles.listRowDetailsStopInfoBorderContainer}>
          <Text style={styles.listRowDetailsStopInfoAddress} numberOfLines={1}>{address}</Text>
        </View>
      </View>
    );
  }

  renderTime() {
    const {stop: {type, color, time, period}} = this.props;

    let label = i18n.t(type);
    if (type === 'visited') {
      label = i18n.t('scheduled'); // roll back value to scheduled if bus is passed
    }

    return (
      <View>
        <View style={styles.listRowDetailsTimeLabelContainer}>
          <Text style={[styles.listRowDetailsTimeLabel, {color}]}>{label}</Text>
        </View>
        <View style={styles.listRowDetailsTimeValueContainer}>
          <Icon name={'clock-o'} size={14} color={color}/>
          <Text style={styles.listRowDetailsTimeValue}>{formatStopTime(time)}</Text>
        </View>
        <View style={styles.listRowDetailsTimePeriodContainer}>
          <Text style={styles.listRowDetailsTimePeriod}>{period}</Text>
        </View>
      </View>
    );
  }

  renderMinutes() {
    const {stop: {color}} = this.props;
    const {label, icon} = this.getMinutesBlockData(this.props);

    return (
      <View style={styles.listRowMinutesContainer}>
        {icon}
        {label &&
          <View style={[styles.listRowMinutesLabelContainer, {backgroundColor: color}]}>
            <Text style={styles.listRowMinutesLabel}>{label}</Text>
          </View>
        }
      </View>
    );
  }

  renderSchoolTime() {
    const {stop: {color, school, pickupOrDropoff}} = this.props;
    const schoolType = get(school, 'type');
    const schoolTime = get(school, 'time');
    if (schoolType === 'completed' && schoolTime && pickupOrDropoff) {
      return (
        <View style={styles.schoolTimeWrapper}>
          <View style={[styles.schoolTimeContainer, {borderColor: color}]}>
            <Text style={[styles.schoolTimeLabel, {color}]}>{i18n.t(`tracker-${pickupOrDropoff}`)}</Text>
            <Text style={styles.schoolTimeText}>{schoolTime}</Text>
          </View>
          <View style={[styles.schoolTimeArrow, {borderColor: color}]}></View>
        </View>
      );
    }
    return <View/>;
  }

  render() {
    const {stop} = this.props;
    const {id, color, schoolName} = stop;
    const {showInfoText} = this.state;
    const {infoText, label} = this.getMinutesBlockData(this.props);
    const isSeeMap = label === i18n.t('seeMap');
    return (
      <View>
        <TouchableHighlight onPress={() => this.handleRowPress(stop, isSeeMap)} underlayColor={colors.lightGrey} key={id}>
          <View style={[styles.listColumn, {borderLeftColor: color}]}>
            {(showInfoText && infoText) && (
              <View style={styles.infoTextRow}>
                {map(split(infoText, '<br>'), (item, index) => <Text key={index} style={styles.infoText}>{trim(item)}</Text>)}
              </View>
            )}
            <View style={styles.listRow}>
              <View style={styles.listRowMinutesContainerWrapper}>
                <View style={styles.absoluteContainer}>
                  <View style={styles.listRowMinutesContainer}>
                    {/*this.renderDebug()*/}
                    {this.renderMinutes()}
                  </View>
                </View>
                {infoText && (
                  <TouchableOpacity style={styles.infoIcon} onPress={this.handleInfoPress}>
                    <Icon name="question-circle" size={18} color={colors.red} />
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.listRowDetailsContainer}>
                <View style={styles.listRowDetailsTopContainer}>
                  {this.renderTime()}
                  {this.renderStopInfo()}
                </View>
              </View>
            </View>
            <View style={styles.listRow}>
              <View style={styles.listRowSchoolTimeContainer}>
                {this.renderSchoolTime()}
              </View>
              <View style={styles.listRowDetailsContainer}>
                <View style={styles.listRowDetailsBottomContainer}>
                  <View style={styles.listRowDetailsBottomContent}>
                    <IcoMoon name={'school-building'} size={16} color={colors.darkGrey}/>
                    <Text style={styles.listRowDetailsBottomText} numberOfLines={1}>{schoolName}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}
