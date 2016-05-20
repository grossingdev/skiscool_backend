import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { AppContainer } from "react-hot-loader";

export default class Root extends Component {
static propTypes = {
  store: React.PropTypes.object.isRequired,
  comp: React.PropTypes.node
};
  render() {
    const { store, comp } = this.props;
    return (
      <Provider store={store} key="provider">
        <AppContainer>{comp}</AppContainer>
      </Provider>
    );
  }
}
