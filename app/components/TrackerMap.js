import React from 'react';
import PropTypes from 'prop-types';
import MapView from 'react-native-maps';
import {View} from 'react-native';
import {convertHexToRgba} from '../utils/colorUtils';
import {calculateRegion} from '../utils/mapUtils';
import BusIcon from '../components/BusIcon';
import SchoolIcon from '../components/SchoolIcon';
import {colors} from '../themes/';
import _ from 'lodash';

import {createIconSetFromIcoMoon} from 'react-native-vector-icons';
import icoMoonConfig from '../themes/fonts/icomoon/selection.json';
const IcoMoon = createIconSetFromIcoMoon(icoMoonConfig);
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './styles/trackerMapStyle';

export default class TrackerMap extends React.Component {
  static propTypes = {
    stops: PropTypes.array,
    zoomToRegion: PropTypes.bool,
    showUserLocation: PropTypes.bool
  }

  static defaultProps = {
    zoomToRegion: false,
    showUserLocation: false
  };

  constructor(props) {
    super(props);

    const region = this.getRegion(props.stops);

    this.state = {
      initialRegion: region || {
        latitude: 39.103119,
        longitude: -84.512016,
        latitudeDelta: 25,
        longitudeDelta: 25
      },
      isMapReady: false
    };

    this.isInitialRegionApplied = false;
    this.isMapReadyInterval = null;
  }

  componentDidMount() {
    this.setMapReadyInterval();
  }

  componentWillUpdate(newProps, newState) {
    if(!this.isInitialRegionApplied && newProps.zoomToRegion && newState.isMapReady) {
      const region = this.getRegion(newProps.stops);
      if (region) {
        setTimeout(() => this.animateToRegion(region, 300), 1000);
        this.isInitialRegionApplied = true;
      }
    }

    if (!newProps.zoomToRegion) {
      this.isInitialRegionApplied = false;
    }
  }

  componentWillUnmount() {
    this.clearMapReadyInterval();
  }

  setMapReadyInterval() {
    this.isMapReadyInterval = setInterval(() => {
      const isMapReady = _.get(this.map, 'state.isReady');
      if (isMapReady) {
        this.clearMapReadyInterval();
        this.setState({isMapReady: true});
      }
    }, 100);
  }

  clearMapReadyInterval() {
    clearInterval(this.isMapReadyInterval);
    this.isMapReadyInterval = null;
  }

  getRegion(stops) {
    const locations = _(stops).map(stop => {
      let coordinates = [{latitude: stop.latitude, longitude: stop.longitude}];
      const vehicleLat = _.get(stop, 'vehicle.latitude');
      const vehicleLng = _.get(stop, 'vehicle.longitude');
      if (vehicleLat && vehicleLng) {
        coordinates.push({latitude: vehicleLat, longitude: vehicleLng});
      }
      const schoolLat = _.get(stop, 'school.latitude');
      const schoolLng = _.get(stop, 'school.longitude');
      if (schoolLat && schoolLng) {
        coordinates.push({latitude: schoolLat, longitude: schoolLng});
      }
      return coordinates;
    }).flatten().value();
    return calculateRegion(locations, {latPadding: 0.001, longPadding: 0.001});
  }

  animateToRegion(...args) {
    if (this.map) {
      this.map.animateToRegion(...args);
    }
  }

  renderSchoolMapMarker(stops = []) {
    return _
      .chain(stops)
      .filter(stop => _.get(stop, 'school.latitude') && _.get(stop, 'school.longitude'))
      .map((stop, index) => {
        const {school: {latitude, longitude}} = stop;
        return (
          <MapView.Marker key={`school${index}`} coordinate={{latitude, longitude}}>
            <SchoolIcon color={colors.darkestGrey}/>
          </MapView.Marker>
        )
      })
      .value();
  }

  renderStopMapMarker(stops = []) {
    return _
      .chain(stops)
      .filter(stop => _.get(stop, 'latitude') && _.get(stop, 'longitude'))
      .map((stop, index) => {
        const {latitude, longitude, color} = stop;
        return (
          <MapView.Marker key={`stop${index}`} coordinate={{latitude, longitude}}>
            <IcoMoon name={'stop-pin'} size={40} color={color}/>
          </MapView.Marker>
        )
      })
      .value();
  }

  renderVehicleMapMarker(stops = []) {
    return _
      .chain(stops)
      .filter(stop => _.get(stop, 'vehicle.latitude') && _.get(stop, 'vehicle.longitude') && _.get(stop, 'vehicle.direction') && _.get(stop, 'shouldShowBus'))
      .map((stop, index) => {
        const {color, vehicle: {latitude, longitude, direction}, shouldShowBus} = stop;
        return (
          <MapView.Marker key={`vehicle${index}`} coordinate={{latitude, longitude}}>
            <BusIcon directionArrow={direction} color={color}/>
          </MapView.Marker>
        )
      })
      .value();
  }

  render() {
    const {stops, showUserLocation} = this.props;
    const {initialRegion} = this.state;

    return (
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={showUserLocation}
        ref={map => this.map = map}
        loadingBackgroundColor={colors.beige}
      >
        {this.renderSchoolMapMarker(stops)}
        {this.renderStopMapMarker(stops)}
        {this.renderVehicleMapMarker(stops)}
      </MapView>
    );
  }
}
