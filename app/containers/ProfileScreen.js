import React from 'react';
import PropTypes from 'prop-types';
import {ScrollView, View, Image, Text, TouchableHighlight, InteractionManager} from 'react-native';
import {connect} from 'react-redux';
import RNApptentive from 'react-native-apptentive';
import {colors, images} from '../themes';
import MainToolbar from '../components/MainToolbar';
import ListItem from '../components/ListItem';
import i18n from '../i18n/i18n.js';
import {Actions as NavActions} from 'react-native-router-flux';
import actions from '../actions/creators';
import Icon from 'react-native-vector-icons/FontAwesome';
import {get, map} from 'lodash';
import Fabric from 'react-native-fabric';
import {trackScreenView} from '../services/googleAnalytics'
import styles from './styles/profileScreenStyle';
const {Answers} = Fabric;

class ProfileScreen extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    profile: PropTypes.object,
    students: PropTypes.array,
    scene: PropTypes.object
  }

  static contextTypes = {
    drawer: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.title = i18n.t('profile');
  }

  componentDidMount() {
    this.fetchData();
    Answers.logContentView('Profile view', 'Screen view', 'profile');
    trackScreenView(this.title);
  }

  componentWillReceiveProps(newProps) {
    const {scene} = newProps;
    const {scene: oldScene} = this.props;

    if (oldScene.sceneKey !== 'profile' && scene.sceneKey === 'profile') {
      this.fetchData();
    }
  }

  fetchData = () => {
    const {dispatch} = this.props;
    dispatch(actions.getProfile());
    dispatch(actions.getStudents());
  }

  handlePressMainToolbarLeft = () => {
    this.context.drawer.toggle();
  };

  handlePressLogout = () => {
    const {dispatch} = this.props;
    dispatch(actions.logout());
  };

  handlePressStudent = (studentNumber) => {
    InteractionManager.runAfterInteractions(() => NavActions.studentSettings({studentNumber}));
    RNApptentive.engage('student_details_selected');
  };

  handlePressAddStudent = () => {
    InteractionManager.runAfterInteractions(() => NavActions.addStudent({previousPage: 'profile'}));
  };

  handlePressEditProfileName = () => {
    const {profile} = this.props;
    InteractionManager.runAfterInteractions(() => NavActions.modifyProfileName({profile, onDone: this.fetchData}));
  };

  handlePressEditPhone = () => {
    const {profile} = this.props;
    InteractionManager.runAfterInteractions(() => NavActions.modifyProfilePhone({profile, onDone: this.fetchData}));
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <MainToolbar title={this.title} leftButton={{icon: 'bars', onPress: this.handlePressMainToolbarLeft}}/>
        <ScrollView style={styles.scrollView}>
          {/*this.renderProfileImageContainer()*/}
          {this.renderProfileContainer()}
          {this.renderStudentsContainer()}
          {this.renderLogoutButton()}

        </ScrollView>
      </View>
    )
  }

  renderProfileImageContainer() {
    const profileImage = images.profile;
    return (
      <View style={styles.profileImageContainer}>
        <Image source={profileImage} style={styles.profileImage}/>
      </View>
    );
  }

  renderProfileContainer() {
    const {profile} = this.props;
    const email = get(profile, 'email');
    const name = `${get(profile, 'first_name', '')} ${get(profile, 'last_name', '')}`;
    const phone = get(profile, 'phone');

    return (
      <View style={styles.profileContainer}>
        <View style={styles.profileHeaderContainer}>
          <Text style={styles.profileHeaderText}>{i18n.t('profile-userProfile')}</Text>
        </View>
        <ListItem label={i18n.t('profile-name')} value={name} chevron={true} onPress={this.handlePressEditProfileName} />
        <ListItem label={i18n.t('profile-phone')} value={phone} chevron={true} onPress={this.handlePressEditPhone} />
        <ListItem label={i18n.t('profile-email')} value={email} />
        <ListItem label={i18n.t('profile-resetPassword')} chevron={true} onPress={NavActions.resetPassword} />
      </View>
    );
  }

  renderStudentsContainer() {
    const {students} = this.props;

    return (
      <View style={styles.studentsContainer}>
        <View style={styles.studentsHeaderContainer}>
          <Text style={styles.studentsHeaderText}>{i18n.t('profile-students')}</Text>
        </View>
        {map(students, student => {
            const studentName = `${student.first_name} ${student.last_name}`;
            const schoolName = get(student, 'school.name');
            return <ListItem
              key={student.student_number}
              label={studentName}
              secondLabel={student.student_number}
              value={schoolName}
              chevron={true}
              onPress={this.handlePressStudent.bind(null, student.student_number)}
            />
          })
        }
        <ListItem label={i18n.t('profile-addStudent')} chevron={true} onPress={this.handlePressAddStudent}/>
      </View>
    );
  }

  renderLogoutButton() {
    return (
      <TouchableHighlight style={styles.logoutButtonContainer} onPress={this.handlePressLogout} underlayColor={colors.lightGrey}>
        <Text style={styles.logoutButtonText}>{i18n.t('profile-logOut')}</Text>
      </TouchableHighlight>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    profile: state.profile.profileData,
    students: state.students.studentsData,
    scene: state.scene.sceneData
  }
};

export default connect(mapStateToProps)(ProfileScreen);
