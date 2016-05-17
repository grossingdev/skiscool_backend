require('babel-core/register')({
  ignore: /node_modules\/(?!react-components)/
});
var React = require('react-native');
var { AppRegistry, Component, View } = React;

import App from './app/App';
import {Provider} from 'react-redux';
import store from './app/redux/stores/stores';

var {
  AppRegistry
  } = React;

class Skiscool extends Component {
  componentDidMount() {
  }

  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }

}

AppRegistry.registerComponent('Skiscool', () => Skiscool)