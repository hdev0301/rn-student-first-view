import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Animated} from 'react-native';
import {metrics} from '../themes';
import {get} from 'lodash';

export default class DynamicListRow extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    remove: PropTypes.bool.isRequired,
    onRowRemoveCallback: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      isMounted: false,
      height: null,
      rowHeight: null,
      rowLeft: new Animated.Value(0),
      rowOpacity: new Animated.Value(1)
    };

    this.defaultTransition = 500;
  }

  componentWillReceiveProps(newProps) {
    const {isMounted, height, rowHeight} = this.state;
    if (isMounted && height !== null && rowHeight !== null) {
      if (newProps.remove) {
        this.onRemoving(newProps.onRowRemoveCallback);
      } else {
        this.onReset();
      }
    }
  }

  componentDidMount() {
    this.setState({isMounted: true});
  }

  onRemoving = (onRowRemoveCallback) => {
    Animated.parallel([
      Animated.timing(this.state.rowOpacity, {
        toValue: 0,
        duration: this.defaultTransition
      }),
      Animated.timing(this.state.rowHeight, {
        toValue: 0,
        duration: this.defaultTransition
      }),
      Animated.timing(this.state.rowLeft, {
        toValue: -1 * metrics.screenWidth,
        duration: this.defaultTransition
      })
    ]).start(() => {
      onRowRemoveCallback();
    });
  };

  onReset = () => {
    Animated.parallel([
      Animated.timing(this.state.rowOpacity, {
        toValue: 1,
        duration: 0
      }),
      Animated.timing(this.state.rowHeight, {
        toValue: this.state.height,
        duration: 0
      }),
      Animated.timing(this.state.rowLeft, {
        toValue: 0,
        duration: 0
      })
    ]).start();
  }

  setHeight = (event) => {
    const height = get(event, 'nativeEvent.layout.height');
    if (!this.state.rowHeight && height) {
      this.setState({rowHeight: new Animated.Value(height), height});
    }
  };

  render() {
    const {rowOpacity, rowLeft, rowHeight} = this.state;
    const {children} = this.props;

    let style = {opacity: rowOpacity, left: rowLeft, height: rowHeight};

    return (
      <Animated.View style={style} onLayout={this.setHeight}>{children}</Animated.View>
    );
  }
}
