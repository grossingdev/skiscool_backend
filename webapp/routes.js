import React from 'react';
import {IndexRoute, Route} from 'react-router';

import Base from './containers/Base';
import Home from './containers/Home';
import TestDevice from './containers/TestDevice';
import AccountView from './containers/Account';
export default () => {
  /**
   * Please keep routes in alphabetical order
   */
  return (

    <Route path="/" component={Base}>
      <IndexRoute component={Home} />
      <Route path="/test" component={TestDevice} />
      <Route path="/signup" component={AccountView} />
      <Route path="/login" component={AccountView} />
      <Route path="*" component={Home} />
    </Route>
  );
};
