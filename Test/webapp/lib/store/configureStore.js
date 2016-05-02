import { createStore, applyMiddleware,compose } from 'redux';
import thunk from 'redux-thunk';
import multi from 'redux-multi';
import rootReducer from '../../reducers';
import DevTools from 'utils/DevTools';
export default function configureStore(initialState, _global_debug) {
  let store;
  let enhancer = compose(
    // Middleware you want to use in development:
    applyMiddleware(thunk, multi)
    // Required! Enable Redux DevTools with the monitors you chose
  );
  if (_global_debug == true) {
    enhancer = compose(
      // Middleware you want to use in development:
      applyMiddleware(thunk, multi),
      DevTools.instrument()
      // Required! Enable Redux DevTools with the monitors you chose
    );
  }
  store = createStore(
    rootReducer,
    initialState,
    enhancer
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../../reducers', () => {
      const nextRootReducer = require('../../reducers/index').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
