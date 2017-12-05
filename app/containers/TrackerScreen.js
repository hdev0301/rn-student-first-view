import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, ActivityIndicator} from 'react-native';
import {get, find, isEmpty} from 'lodash';
import RNApptentive from 'react-native-apptentive';
import {calculateRegion} from '../utils/mapUtils';
import {connect} from 'react-redux';
import MainToolbar from '../components/MainToolbar';
import TrackerMap from '../components/TrackerMap';
import TrackerList from '../components/TrackerList';
import CustomButton from '../components/CustomButton';
import StudentStopListFooter from '../components/StudentStopListFooter';
import i18n from '../i18n/i18n.js';
import actions from '../actions/creators';
import {createStructuredSelector} from 'reselect';
import {selectStops} from '../selectors/stopsSelector';
import {colors} from '../themes';
import {Actions as NavActions} from 'react-native-router-flux';
import Fabric from 'react-native-fabric';
import {trackScreenView} from '../services/googleAnalytics'
const {Answers} = Fabric;

import styles from './styles/trackerScreenStyle';

class TrackerScreen extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    stopsData: PropTypes.shape({
      stops: PropTypes.array,
      hasInactiveStops: PropTypes.bool
    }),
    stopsFetching: PropTypes.bool
  }

  static contextTypes = {
    drawer: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.zoomToRegion = false;
    this.title = i18n.t('tracker');
  }

  componentDidMount() {
    this.props.dispatch(actions.getStops());
    Answers.logContentView('Map view', 'Screen view', 'map');
    trackScreenView(this.title);
  }

  componentWillReceiveProps(newProps) {
    const {stopsFetching: newStopsFetching, currentState: newCurrentState, dispatch} = newProps;
    const {stopsFetching: oldStopsFetching, currentState: oldCurrentState} = this.props;

    if (!newStopsFetching && oldStopsFetching) {
      this.zoomToRegion = true;
    }

    if (oldCurrentState && oldCurrentState !== newCurrentState) {
      if (newCurrentState === 'background') {
        this.zoomToRegion = false;
        dispatch(actions.stopEtaRefreshLoop());
      } else if (newCurrentState === 'active') {
        this.zoomToRegion = true;
        dispatch(actions.startEtaRefreshLoop());
      }
    }
  }

  componentWillUnmount() {
    this.props.dispatch(actions.stopEtaRefreshLoop());
  }

  handlePressMainToolbarLeft = () => {
    this.context.drawer.toggle();
  }

  handlePressTrackerListRow = (rowData, isSeeMap) => {
    const {stopsData: {stops}} = this.props;
    const stopCoordinate = {latitude: rowData.latitude, longitude: rowData.longitude};
    const schoolCoordinate = {latitude: get(rowData, 'school.latitude'), longitude: get(rowData, 'school.longitude')};
    const directions = get(find(stops, {id: rowData.id}), 'directions', [stopCoordinate]);
    const region = calculateRegion(directions.concat([schoolCoordinate]), {latPadding: 0.1, longPadding: 0.1});
    this.trackerMap.map.animateToRegion(region, 300);
    if (isSeeMap) {
      RNApptentive.engage('see_map_tapped');
    }
  }

  handleAddStudent = () => {
    NavActions.addStudent({previousPage: 'tracker'});
  }

  renderTrackerList = () => {
    const {stopsData: {stops, hasInactiveStops}, stopsFetching} = this.props;

    if (stopsFetching) {
      return <ActivityIndicator color={colors.darkBlue} animating={true} size={'large'}/>;
    } else if (isEmpty(stops)) {
      return (
        <View style={styles.noStudentsOrServicesContainer}>
          {!hasInactiveStops && (
            <View style={[styles.buttonContainer]}>
              <CustomButton
                onPress={this.handleAddStudent}
                label={i18n.t('tracker-addStudent')}
                fillColor={colors.yellow}
                borderColor={colors.yellow}
              />
            </View>
          )}
          <View style={styles.noStudentsOrServicesTextContainer}>
            <Text style={styles.noStudentsOrServicesText}>{hasInactiveStops ? i18n.t('tracker-noServices') : i18n.t('tracker-noStudents')}</Text>
          </View>
          <StudentStopListFooter />
        </View>
      )
    } else {
      return (
        <TrackerList
          stops={stops}
          onRowPress={this.handlePressTrackerListRow}
        />
      );
    }
  }

  render() {
    const {stopsData: {stops}} = this.props;
    return (
      <View style={styles.mainContainer}>
        <MainToolbar
          title={this.title}
          leftButton={{icon: 'bars', onPress: this.handlePressMainToolbarLeft}}
          showEtaUpdateTimer={true}
        />
        <View style={styles.mapContainer}>
          <TrackerMap
            stops={stops}
            zoomToRegion={this.zoomToRegion}
            ref={trackerMap => this.trackerMap = trackerMap}
          />
        </View>
        <View style={styles.listContainer}>{this.renderTrackerList()}</View>
      </View>
    )
  }
};

const mapStateToProps = createStructuredSelector({
  stopsData: selectStops(),
  currentState: (state) => state.appState.currentState,
  stopsFetching: (state) => state.tracker.stopsFetching
});

export default connect(mapStateToProps)(TrackerScreen);
