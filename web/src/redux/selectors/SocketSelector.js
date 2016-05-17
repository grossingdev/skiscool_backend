/**
 * Created by baebae on 4/30/16.
 */
import {createSelector} from 'reselect';

// account-wide selector
export const socketConnected$ = (state) => state.socketClient.connected;
export const socketMessage$ = (state) => state.socketClient.message;
export const socketSelector$ = createSelector(socketConnected$, socketMessage$,
  (socketConnected, socketMessage) => ({
  socketConnected, socketMessage
}));
