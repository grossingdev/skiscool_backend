import React from 'react';
import {IndexRoute, Route} from 'react-router';

import Base from './containers/Base';
import Home from './containers/Home';
import TestDevice from './containers/TestDevice';
export default () => {
  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path="/" component={Base}>
      <IndexRoute component={Home} />
      <Route path="/test" component={TestDevice} />
    </Route>
  );
};
