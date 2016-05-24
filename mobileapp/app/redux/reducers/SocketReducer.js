/**
 * Created by baebae on 4/30/16.
 */
import {SOCKET_CONNECTED, UPDATE_SOCKET_MESSAGE} from '../actions/SocketActions';
import defaultState from './defaultState';

export default function socketClient(state = defaultState.socketClient, action) {
  switch (action.type) {
    case SOCKET_CONNECTED:
      return Object.assign({}, state, { connected: action.payload });
    case UPDATE_SOCKET_MESSAGE:
      return Object.assign({}, state, { message: action.payload });
      return state;
    default:
      return state;
  }
}
