import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import MainToolbar from '../components/MainToolbar';
import ListItem from '../components/ListItem';
import i18n from '../i18n/i18n.js';
import {Actions as NavActions, ActionConst as NavActionConst} from 'react-native-router-flux';
import actions from '../actions/creators';
import {map} from 'lodash';
import {trackScreenView} from '../services/googleAnalytics';
import styles from './styles/notificationRecipientsScreenStyle';

class NotificationRecipientsScreen extends Component {
  static propTypes = {
    recipients: PropTypes.array
  }

  constructor(props) {
    super(props);
    this.title = i18n.t('notificationRecipients');
  }

  componentDidMount() {
    this.fetchData();
    trackScreenView(this.title);
  }

  fetchData = () => {
    const {dispatch} = this.props;
    dispatch(actions.getNotificationContacts());
  }

  handlePressMainToolbarLeft = () => {
    NavActions.settings({type: NavActionConst.BACK});
  }

  handlePressEditRecipient = (recipient) => {
    NavActions.modifyRecipient({recipient, onDone: this.fetchData});
  };

  handlePressAddRecipient = () => {
    NavActions.modifyRecipient({onDone: this.fetchData});
  };

  render() {
    const {recipients} = this.props;
    return (
      <View style={styles.mainContainer}>
        <MainToolbar title={this.title} leftButton={{icon: 'chevron-left', onPress: this.handlePressMainToolbarLeft}}/>
        <ScrollView style={styles.scrollView}>
          <View style={styles.introTextContainer}>
            <Text style={styles.introTextFirst}>{i18n.t('notificationRecipients-intro')}</Text>
            <Text style={styles.introTextLast}>{i18n.t('notificationRecipients-maxRecipients')}</Text>
          </View>
          <View style={styles.recipientsListContainer}>
            {map(recipients, recipient => <ListItem key={recipient.id} label={recipient.name} chevron={true} onPress={this.handlePressEditRecipient.bind(null, recipient)}/>)}
            <ListItem label={i18n.t('notificationRecipients-addRecipient')} chevron={true} onPress={this.handlePressAddRecipient}/>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    recipients: state.notificationContacts.notificationContactsData
  }
};

export default connect(mapStateToProps)(NotificationRecipientsScreen);
