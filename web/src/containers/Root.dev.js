import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { AppContainer } from "react-hot-loader";

let devTools;

if ( __DEVELOPMENT__ && __DEVTOOLS__) {
  const DevTools = require( './DevTools' );
  devTools = <DevTools />;
}

export default class Root extends Component {
static propTypes = {
  store: React.PropTypes.object.isRequired,
  comp: React.PropTypes.node
};
  render() {
    const { store, comp } = this.props;
    return (
      <Provider store={store} key="provider">
        <div>
        <AppContainer>{comp}</AppContainer>
          <DevTools />
        </div>
      </Provider>
    );
  }
}
