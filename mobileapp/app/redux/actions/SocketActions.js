/**
 * Created by baebae on 4/30/16.
 */
import { createAction } from 'redux-actions';
export const SOCKET_CONNECTED = 'SOCKET_CONNECTED';
export const setSocketClientConnected$ = createAction(SOCKET_CONNECTED);

export const UPDATE_SOCKET_MESSAGE = 'UPDATE_SOCKET_MESSAGE';
export const updateSocketMessage$ = createAction(UPDATE_SOCKET_MESSAGE);


export const setSocketClientConnected = (status) => {
  return (dispatch) => {
    dispatch(setSocketClientConnected$(status));
  };
};

export const updateSocketMessage = (message) => {
  return (dispatch) => {
    dispatch(updateSocketMessage$(message));
  };
}
