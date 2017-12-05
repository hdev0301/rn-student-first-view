import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Svg, {G, Path} from 'react-native-svg';
import {colors} from '../themes/';

export default class SchoolIcon extends Component {
  static propTypes = {
    color: PropTypes.string.isRequired
  }

  render() {
    const {color} = this.props;

    return (
      <Svg width="33" height="33">
        <G>
          <G>
            <Path d="M32.318,18.876L28.292,18.876L28.292,10.912L29.612,10.912L29.612,10.626L16.742,2.926L16.192,2.926L3.212,10.626L3.212,10.912L4.4,10.912L4.4,18.876L-5.80073e-30,18.876L-5.91776e-30,19.646L0.682,19.646L0.682,30.074L32.318,30.074L32.318,19.646L33,19.646L33,18.876ZM16.5,5.126C17.6345,5.126 18.568,6.05953 18.568,7.194C18.568,8.32847 17.6345,9.262 16.5,9.262C15.3655,9.262 14.432,8.32847 14.432,7.194C14.432,6.05953 15.3655,5.126 16.5,5.126ZM18.326,13.068L18.326,16.654L14.674,16.654L14.674,13.002ZM11,16.654L7.26,16.654L7.26,13.002L11,13.002ZM19.052,29.04L14.036,29.04L14.036,20.966L18.964,20.966ZM25.74,16.654L22,16.654L22,13.002L25.74,13.002Z" fill={color}/>
          </G>
        </G>
      </Svg>
    )
  }
}
