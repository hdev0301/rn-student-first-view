import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, ListView, TouchableOpacity} from 'react-native';
import i18n from '../i18n/i18n.js';
import {colors} from '../themes';
import {cloneDeep, filter, get} from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';
import {getFormattedLocalCalendarTime} from '../utils/dateUtils';
import DynamicListRow from '../components/DynamicListRow';

import styles from './styles/notificationsListStyle';

export default class NotificationsList extends React.Component {
  static propTypes = {
    notifications: PropTypes.array,
    onRowRemovePress: PropTypes.func.isRequired,
    notificationsFetching: PropTypes.bool.isRequired,
    notificationRemoveSubmitting: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props);

    const rowHasChanged = (r1, r2) => r1 !== r2;
    this.ds = new ListView.DataSource({rowHasChanged});
    this.data = cloneDeep(props.notifications) || [];

    this.state = {
      dataSource: this.ds.cloneWithRows(this.data),
      rowIdToDelete: null
    };
  }

  componentWillReceiveProps(newProps) {
    const {notificationRemoveSubmitting, notificationsFetching} = newProps;
    const {notificationRemoveSubmitting: oldNotificationRemoveSubmitting} = this.props;

    if (!(notificationsFetching || notificationRemoveSubmitting || oldNotificationRemoveSubmitting && !notificationRemoveSubmitting)) {
      this.data = newProps.notifications;
      this.setState({
        dataSource: this.ds.cloneWithRows(this.data),
        rowIdToDelete: null
      });
    }
  }

  componentWillUpdate(nexProps, nexState) {
    if (nexState.rowIdToDelete !== null) {
      this.data = filter(this.data, (item) => item.id !== nexState.rowIdToDelete);
    }
  }

  handleRowRemovePress = (rowData) => {
    const {notificationsFetching, notificationRemoveSubmitting} = this.props;
    if (!this.state.rowIdToDelete && !notificationsFetching && !notificationRemoveSubmitting) {
      this.setState({
        dataSource: this.ds.cloneWithRows(this.data),
        rowIdToDelete: get(rowData, 'id')
      });
    }
  }

  handleAfterRemovingElement = (rowData) => {
    const {onRowRemovePress} = this.props;
    this.setState({
      dataSource: this.ds.cloneWithRows(this.data),
    });
    onRowRemovePress(rowData)
  }

  renderRow(rowData) {
    const {id, title, contents, created_at} = rowData;
    const {rowIdToDelete} = this.state;
    const {notificationsFetching, notificationRemoveSubmitting} = this.props;

    const activeOpacity = !notificationsFetching && !notificationRemoveSubmitting ? 0.2 : 1;

    return (
      <DynamicListRow
        remove={id === rowIdToDelete}
        onRowRemoveCallback={this.handleAfterRemovingElement.bind(this, rowData)}
      >
        <View style={styles.listRow}>
          <View style={styles.listRowBellIconContainer}>
            <Icon name={'bell'} size={24} color={colors.blue}/>
          </View>
          <View style={styles.listRowDetails}>
            <View style={styles.listRowDetailsContainer}>
              <Text style={styles.notificationDetailTitle}>{title}</Text>
              <Text style={styles.notificationDetailContent}>{contents}</Text>
              <Text style={styles.notificationDetailDate}>{getFormattedLocalCalendarTime(created_at)}</Text>
            </View>
          </View>
          <View style={styles.listRowRemoveIconContainer}>
            <TouchableOpacity onPress={this.handleRowRemovePress.bind(this, rowData)} style={styles.removeButton} activeOpacity={activeOpacity}>
              <Icon name={'trash'} size={24} color={colors.darkGrey}/>
            </TouchableOpacity>
          </View>
        </View>
      </DynamicListRow>
    );
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}
        enableEmptySections={true}
      />
    )
  }
}
