import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, Image, TouchableOpacity, AsyncStorage} from 'react-native';
import {connect} from 'react-redux';
import actions from '../actions/creators';
import {metrics, images, colors} from '../themes';
import i18n from '../i18n/i18n.js';
import {Actions as NavActions, ActionConst as NavActionConst} from 'react-native-router-flux';
import {trackScreenView} from '../services/googleAnalytics'
import styles from './styles/walkthroughScreenStyle';

import Carousel from 'react-native-carousel';

class WalkthroughScreen extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    hasSeenWalkthrough: PropTypes.bool
  }

  constructor(props) {
    super(props);

    this.state = {
      lastSlideActive: false
    };

    this.slides = [
      {
        image: images.walkthrough1profile,
        heading: i18n.t('walkthroughHeading1'),
        text: i18n.t('walkthroughText1')
      },
      {
        image: images.walkthrough2map,
        heading: i18n.t('walkthroughHeading2'),
        text: i18n.t('walkthroughText2')
      },
      {
        image: images.walkthrough3notifications,
        heading: i18n.t('walkthroughHeading3'),
        text: i18n.t('walkthroughText3')
      },
      {
        image: images.walkthrough4feedback,
        heading: i18n.t('walkthroughHeading4'),
        text: i18n.t('walkthroughText4')
      }
    ];

    this.title = i18n.t('walkthrough');
  }

  componentDidMount() {
    trackScreenView(this.title);
  }

  handlePressSkip = () => {
    const {dispatch, hasSeenWalkthrough} = this.props;
    if (hasSeenWalkthrough) {
      NavActions.pop();
    } else {
      dispatch(actions.setHasSeenWalkthrough());
      NavActions.tracker({type: NavActionConst.REPLACE});
    }
  }

  handleOnPageChange = (activeIndex) => {
    this.setState({
      lastSlideActive: activeIndex === this.slides.length - 1
    });
  }

  renderCarouselSlides() {
    return this.slides.map((slide, index) => (
      <View style={styles.carouselSlide} key={index}>
        <Image source={slide.image} style={styles.carouselSlideImage} />
        <View style={styles.infoContainer}>
          <Text style={styles.walkthroughHeading}>{slide.heading}</Text>
          <Text style={styles.walkthroughText} numberOfLines={3}>{slide.text}</Text>
        </View>
      </View>
    ));
  }

  render() {
    const {lastSlideActive} = this.state;
    const width = metrics.screenWidth;
    const height = metrics.screenHeight - metrics.statusBarHeight - metrics.walkthroughSkipButtonHeight;
    const buttonMessageId = `walkthrough-button${lastSlideActive ? 'Last' : ''}`;

    return (
      <View style={styles.mainContainer}>
        <View style={styles.carouselContainer}>
          <Carousel
            width={width}
            loop={false}
            animate={false}
            indicatorAtBottom={true}
            indicatorOffset={0}
            indicatorColor={colors.darkBlue}
            inactiveIndicatorColor={colors.grey}
            onPageChange={this.handleOnPageChange}
          >
            {this.renderCarouselSlides()}
          </Carousel>
        </View>
        <TouchableOpacity style={styles.skipButton} onPress={this.handlePressSkip}>
          <Text style={styles.skipButtonText}>{i18n.t(buttonMessageId)}</Text>
        </TouchableOpacity>
      </View>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    hasSeenWalkthrough: state.walkthroughPersistent.hasSeenWalkthrough
  };
};

export default connect(mapStateToProps)(WalkthroughScreen);
