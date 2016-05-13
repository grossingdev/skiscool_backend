/**
 * Created by baebae on 5/3/16.
 */
import { createAction } from 'redux-actions';
import LocalStorage from 'utils/localStorage';

import API from 'utils/api';
import {apiResult$} from './APIResultActions';

export const LOGIN = 'LOGIN';
const login$ = createAction(LOGIN);
export const checkToken = () => {
  return (dispatch) => {
    let token = LocalStorage.get('token');
    if (token && token.length > 0) {
      API.account.checkToken(null, {
        token: token,
      }, dispatch).then((res) => {
        if (res.data.token && res.data.token.length > 0) {
          LocalStorage.set("token", res.data.token);
          dispatch(login$({
            authenticated: true,
            token: res.data.token,
            profile: res.data.user
          }));
        }
      });
    }

  };
}
export const login = (param) => {
  return (dispatch) => {
    API.account.login(null, param, dispatch)
      .then((res) => {
        console.info('login result', res);
        if (res.data.token && res.data.token.length > 0) {
          LocalStorage.set("token", res.data.token);
          dispatch(login$({
            authenticated: true,
            token: res.data.token,
            profile: res.data.user
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
          LocalStorage.set("token", '');
          dispatch(login$({
            authenticated: false,
            token: '',
            profile: {}
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
          token: res.data.token,
          profile: res.data.user
        }));
      }
    });
  };
}