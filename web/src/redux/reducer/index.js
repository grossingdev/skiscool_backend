/**
 * Created by baebae on 4/29/16.
 */
import { combineReducers } from 'redux';
import socketClient from './SocketReducer';
import user from './UserReducer';
import map_status from './MapReducer';
import { routerReducer } from 'react-router-redux';
import {reducer as reduxAsyncConnect} from 'redux-async-connect';
import apiResult from './ApiResultReducer';
const rootReducer = combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  socketClient,
  user,
  apiResult,
  map_status
});

export default rootReducer;
