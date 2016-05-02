import React from 'react';
import { Router, IndexRoute, Route, browserHistory } from 'react-router';

import Base from './handlers/Base';
import Home from './handlers/Home';
import TestDevice from './handlers/TestDevice';
import NotFound from './handlers/NotFound';

var routes = (
  <Route path="/" component={Base}>
    <IndexRoute component={Home} />
    <Route path="/test" component={TestDevice} />
  </Route>
);

export default routes;
