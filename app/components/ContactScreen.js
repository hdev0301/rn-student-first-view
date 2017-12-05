import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, WebView, ActivityIndicator} from 'react-native';
import MainToolbar from './MainToolbar';
import i18n from '../i18n/i18n.js';
import {Actions as NavActions, ActionConst as NavActionConst} from 'react-native-router-flux';
import {trackScreenView} from '../services/googleAnalytics';
import styles from '../containers/styles/helpScreenStyle';
import {colors} from '../themes';

export default class ContactScreen extends Component {
  constructor(props) {
    super(props);
    this.title = i18n.t('helpContactAndSupport');
  }

  componentDidMount() {
    trackScreenView(this.title);
  }

  handlePressMainToolbarLeft = () => {
    NavActions.help({type: NavActionConst.BACK});
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <MainToolbar title={this.title} leftButton={{icon: 'chevron-left', onPress: this.handlePressMainToolbarLeft}}/>
        <WebView
          source={{uri: 'https://firstview-site.herokuapp.com/contact.html'}}
          style={styles.webView}
          startInLoadingState={true}
          loading={true}
          renderLoading={() => <View style={styles.loadingView}><ActivityIndicator color={colors.darkBlue} animating={true} size={'large'}/></View>}
          />
      </View>
    )
  }
}
