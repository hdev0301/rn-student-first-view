import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {setCustomText, setCustomTextInput} from 'react-native-global-props';
import configureStore, {getStore} from './core/store';
import configureAnalytics from './services/googleAnalytics';
import {fonts} from './themes';
import Root from './containers/Root';

const defaultStyle = {fontFamily: fonts.type.openSans};
setCustomText({style: defaultStyle});
setCustomTextInput({style: defaultStyle});

console.disableYellowBox = !__DEV__;

class App extends Component {
  state = {
    ready: false
  };

  async componentDidMount() {
    configureAnalytics();
    await configureStore();
    this.setState({ready: true});
  }

  render() {
    const {ready} = this.state;
    return ready ? (<Provider store={getStore()}><Root /></Provider>) : null;
  }
}

export default App;
