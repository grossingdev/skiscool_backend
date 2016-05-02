import React from 'react';
import { render } from 'react-dom';
import routes from './routes';
import { Provider } from 'react-redux';
import initialState from 'store/defaultState';
import Root from './Root';
import configureStore from 'store/configureStore';
let _global_debug = true;

const store = configureStore(initialState, _global_debug);
render(
  (
    <Root routes={routes} store={store} debug={_global_debug}/>
  ),
  document.getElementById('root')
);
