/**
 * Created by baebae on 5/2/16.
 */
import React, { PropTypes } from 'react';
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router';

import LogMonitor from 'redux-devtools-log-monitor'
import DockMonitor from 'redux-devtools-dock-monitor'
import DevTools from 'utils/DevTools';

export default class Root extends React.Component {
  static propTypes = {
    routes: PropTypes.element.isRequired,
    store: PropTypes.object.isRequired
  };

  renderContent () {
    return (
      <Router history={browserHistory}>
        {this.props.routes}
      </Router>
    )
  }

  renderReduxDevTools () {
    if (this.props.debug == true) {
      return (
        <DevTools></DevTools>
      )
    }
  }

  render () {
    return (
      <Provider store={this.props.store}>
        <div style={{height: '100%', overflowY: 'auto'}}>
          {this.renderContent()}
          {this.renderReduxDevTools()}
        </div>
      </Provider>
    )
  }
}
