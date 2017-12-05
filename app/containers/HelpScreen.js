import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {ListView, View, Text, TouchableHighlight} from 'react-native';
import Fabric from 'react-native-fabric';
import {colors} from '../themes';
import {connect} from 'react-redux';
import MainToolbar from '../components/MainToolbar';
import i18n from '../i18n/i18n.js';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Actions as NavActions} from 'react-native-router-flux';
import {trackScreenView} from '../services/googleAnalytics';
import styles from './styles/helpScreenStyle';
const {Answers} = Fabric;

class HelpScreen extends Component {
  static contextTypes = {
    drawer: PropTypes.object
  }

  constructor(props) {
    super(props);

    const rowHasChanged = (r1, r2) => r1 !== r2;
    this.ds = new ListView.DataSource({rowHasChanged});

    const helpLinks = [
      {
        text: i18n.t('helpFaq'),
        action: NavActions.faq
      },
      {
        text: i18n.t('helpContactAndSupport'),
        action: NavActions.contact
      },
      {
        text: i18n.t('helpTermsAndConditions'),
        action: NavActions.termsAndConditions
      },
      {
        text: i18n.t('privacyPolicy'),
        action: NavActions.privacyPolicy
      },
      {
        text: i18n.t('helpAppAbout'),
        action: NavActions.about
      },
      {
        text: i18n.t('helpAppWalkthrough'),
        action: NavActions.walkthrough
      },
    ];

    this.state = {
      dataSource: this.ds.cloneWithRows(helpLinks)
    };

    this.title = i18n.t('help');
  }

  componentDidMount() {
    Answers.logContentView('Help view', 'Screen view', 'help');
    trackScreenView(this.title);
  }

  handlePressMainToolbarLeft = () => {
    this.context.drawer.toggle();
  }

  renderRow(rowData) {
    return (
      <TouchableHighlight onPress={rowData.action} underlayColor={colors.lightGrey}>
        <View style={styles.listRow}>
          <View style={styles.listRowTextContainer}>
            <Text style={styles.listRowText}>{rowData.text}</Text>
          </View>
          <View style={styles.listRowArrowContainer}>
            <Icon name={'angle-right'} size={24} color={colors.darkerGrey}/>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <View style={[styles.mainContainer]}>
        <MainToolbar title={this.title} leftButton={{icon: 'bars', onPress: this.handlePressMainToolbarLeft}}/>
        <ListView
          style={styles.listView}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
};

export default connect(mapStateToProps)(HelpScreen);
