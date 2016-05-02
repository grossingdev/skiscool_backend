/**
 * Created by baebae on 4/29/16.
 */
import { combineReducers } from 'redux';
import socketClient from './SocketReducer';

const rootReducer = combineReducers({
  socketClient
});

export default rootReducer;
