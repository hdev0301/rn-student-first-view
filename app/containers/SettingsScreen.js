import React, { PropTypes } from 'react';
import { ListView, View, Image, Text, TouchableHighlight } from 'react-native';
import {colors, images} from '../themes';
import { connect } from 'react-redux';
import MainToolbar from '../components/MainToolbar';
import i18n from '../i18n/i18n.js';
import {Actions as NavActions} from 'react-native-router-flux';
import styles from './styles/settingsScreenStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import {trackScreenView} from '../services/googleAnalytics'
import Fabric from 'react-native-fabric';
const {Answers} = Fabric;

class SettingsScreen extends React.Component {
  static contextTypes = {
    drawer: PropTypes.object
  }

  constructor(props) {
    super(props);

    const rowHasChanged = (r1, r2) => r1 !== r2;
    this.ds = new ListView.DataSource({rowHasChanged});

    const settingsLinks = [
      {
        text: i18n.t('settings-notificationSettings'),
        action: NavActions.notificationSettings
      },
      {
        text: i18n.t('settings-notificationRecipients'),
        action: NavActions.notificationRecipients
      },
      {
        text: i18n.t('settingsEditProfile'),
        action: NavActions.profile
      }
    ];

    this.state = {
      dataSource: this.ds.cloneWithRows(settingsLinks)
    };

    this.title = i18n.t('settings');
  }

  componentDidMount() {
    Answers.logContentView('Settings view', 'Screen view', 'settings');
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

  render () {
    return (
      <View style={styles.mainContainer}>
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
  return {
  }
}

export default connect(mapStateToProps)(SettingsScreen)
