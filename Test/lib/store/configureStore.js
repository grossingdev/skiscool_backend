import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import multi from 'redux-multi';
import rootReducer from '../../reducers';

export default function configureStore(initialState) {
  let store;
  let middleware = [
    thunk,
    multi,
  ];

  store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(...middleware)
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../../reducers', () => {
      const nextRootReducer = require('../../reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
