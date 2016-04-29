import React from 'react';
import { Router, IndexRoute, Route, browserHistory } from 'react-router';

import TestDevice from './handlers/TestDevice';

import NotFound from './handlers/NotFound';

var routes = (
  <Router history={browserHistory}>
    <Route path="/">
      <IndexRoute component={TestDevice} />
    </Route>
  </Router>
);

export default routes;
