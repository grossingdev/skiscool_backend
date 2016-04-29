import React from 'react';
import { render } from 'react-dom';
import Routes from './routes';
import { Provider } from 'react-redux';
import configureStore from 'store/configureStore';
import initialState from 'store/defaultState';

const store = configureStore(initialState);

render(
  (
    <Provider store={store}>
      {Routes}
    </Provider>
  ),
  document.getElementById('root')
);
