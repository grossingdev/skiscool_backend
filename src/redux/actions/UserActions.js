/**
 * Created by baebae on 5/3/16.
 */
import { createAction } from 'redux-actions';
import LocalStorage from 'utils/localStorage';

import API from 'utils/api';
import {apiResult$} from './APIResultActions';

export const LOGIN = 'LOGIN';
const login$ = createAction(LOGIN);

export const login = (param) => {
  return (dispatch) => {
    API.account.login(null, param, dispatch)
      .then((res) => {
        console.info('login result', res);
        if (res.data.token && res.data.token.length > 0) {
          LocalStorage.set("token", res.data.token);
          dispatch(login$({
            authenticated: true,
            token: res.data.token
          }));
        }
      });
  };
}

export const logout = () => {
  return (dispatch) => {
    API.account.logout(null, {name}, dispatch)
      .then((user) => {
        if (user.success == true) {
          dispatch(login$({
            authenticated: false,
          }))
        }
      });
  };
}

export const signIn = (param) => {
  return (dispatch) => {
    API.account.signIn(null, param, dispatch).then((res) => {
      dispatch(apiResult$({
        err_code: 0
      }));

      if (res.data.token && res.data.token.length > 0) {
        LocalStorage.set("token", res.data.token);
        dispatch(login$({
          authenticated: true,
          token: res.data.token
        }));
      }
    });
  };
}