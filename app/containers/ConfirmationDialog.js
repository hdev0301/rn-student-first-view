import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';
import Modal from 'react-native-modalbox';
import CustomButton from '../components/CustomButton';
import actions from '../actions/creators';
import i18n from '../i18n/i18n.js';
import styles from './styles/confirmationDialogStyle';

class ConfirmationDialog extends Component {
  static propTypes = {
    dispatch: PropTypes.func
  }

  handlePressOk = () => {
    const {dispatch} = this.props;
    dispatch(actions.clearConfirmationDialogMessage());
  }

  render() {
    const {message} = this.props;
    return (
      <Modal style={styles.modal} position={"center"} backdropPressToClose={false} swipeToClose={false} isOpen={!!message}>
        <View style={styles.modalMessage}>
          <Text style={styles.modalMessageText}>{message}</Text>
        </View>
        <View style={[styles.buttonContainer]}>
          <CustomButton onPress={this.handlePressOk} label={i18n.t('confirmationDialog-ok')}/>
        </View>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    message: state.confirmationDialog.message
  }
};

export default connect(mapStateToProps)(ConfirmationDialog);
