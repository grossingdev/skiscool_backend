/**
 * Created by baebae on 4/29/16.
 */
import { combineReducers } from 'redux';
import socketClient from './SocketReducer';
import user from './UserReducer';
import { routerReducer } from 'react-router-redux';
import {reducer as reduxAsyncConnect} from 'redux-async-connect';
const rootReducer = combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  socketClient,
  user
});

export default rootReducer;
