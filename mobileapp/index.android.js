var React = require('react-native');
var { AppRegistry, Component, View } = React;

import App from './app/App';
import {Provider} from 'react-redux/native';
import store from './app/redux/stores/stores';

var {
  AppRegistry
  } = React;

class Snapvital extends Component {
  componentDidMount() {
  }

  render() {
    return (
      <Provider store={store}>
        {() => <App />}
      </Provider>
    );
  }

}

AppRegistry.registerComponent('test', () => Snapvital)