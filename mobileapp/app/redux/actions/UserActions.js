/**
 * Created by baebae on 4/21/16.
 */
import { createAction } from 'redux-actions';
import LocalStorage from '../../utils/localStorage';
import {log_console} from '../../utils/log';
import API from '../../utils/api';

import {updateAPILoadingStatus} from './UIActions';
import {resetAPIResult} from './APIResultActions';

export const LOGIN = 'LOGIN';
const login$ = createAction(LOGIN);

export const checkToken = () => {
  return (dispatch) => {
    LocalStorage.get('token')
      .then((token) => {
        if (token && token.length > 0) {
          dispatch(updateAPILoadingStatus(true));
          dispatch(resetAPIResult());
          API.account.checkToken(null, {token})
            .then((res) => {
              dispatch(updateAPILoadingStatus(false));
              if (res.data.token && res.data.token.length > 0) {
                LocalStorage.set("token", res.data.token);
                dispatch(login$({
                  authenticated: true,
                  token: res.data.token,
                  profile: res.data.user
                }));
              }
          }).catch((err) => {
            dispatch(updateAPILoadingStatus(false));
          });
        }
      });
  };
}

export const login = (param) => {
  return (dispatch) => {
    dispatch(updateAPILoadingStatus(true));
    dispatch(resetAPIResult());
    API.account.login(null, param, dispatch)
      .then((res) => {
        console.info('login result', res);
        dispatch(updateAPILoadingStatus(false));
        if (res.data.token && res.data.token.length > 0) {
          LocalStorage.set("token", res.data.token);
          dispatch(login$({
            authenticated: true,
            token: res.data.token,
            profile: res.data.user
          }));
        }
      }).catch((err) => {
        dispatch(updateAPILoadingStatus(false));
      });
  };
}

export const logout = () => {
  return (dispatch) => {
    API.account.logout(null, {}, dispatch)
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
    dispatch(updateAPILoadingStatus(false));
    dispatch(resetAPIResult());

    API.account.signIn(null, param, dispatch)
      .then((res) => {
        dispatch(updateAPILoadingStatus(false));
        if (res.data.token && res.data.token.length > 0) {
          LocalStorage.set("token", res.data.token);
          dispatch(login$({
            authenticated: true,
            token: res.data.token,
            profile: res.data.user
          }));
        }
      }).catch((err) => {
        dispatch(updateAPILoadingStatus(false));
      });;
  };
}

