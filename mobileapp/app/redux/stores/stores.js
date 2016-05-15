/**
 * Created by baebae on 3/24/16.
 */
// This module bootstraps and exports the flux store
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
// Import the root reducer (which imports all subreducers)
import rootReducer from '../reducers/index';

let store;

// Initializing with middleware
const createStoreWithMiddleware = applyMiddleware(thunk);

const finalCreateStore = compose(createStoreWithMiddleware)(createStore);

// Create the store with an initial (empty) state
// In a complex application, we might rehydrate this state from AsyncStorage or etc

store = finalCreateStore(rootReducer);

export default store;
