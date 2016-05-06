/**
 * Created by baebae on 5/3/16.
 */
import { createAction } from 'redux-actions';
import API from 'utils/api';
export const LOGIN = 'LOGIN';
const login$ = createAction(LOGIN);

export const login = (param) => {
  return (dispatch) => {
    API.account.login(null, param)
      .then((user) => {
        if (user.authenticated == true) {
          dispatch(login$({
            authenticated: true,
          }))
        }
      })
      .catch((err) => {
        dispatch(login$({
          authenticated: false,
        }));
      });
  };
}

export const logout = () => {
  return (dispatch) => {
    API.account.logout(null, {name})
      .then((user) => {
        if (user.success == true) {
          dispatch(login$({
            authenticated: false,
          }))
        }
      })
      .catch((err) => {
      });
  };
}

export const signIn = (param) => {
  return (dispatch) => {
    API.account.signIn(null, param).then((res) => {
      if (res.authenticated == true) {
        dispatch(login$({
          authenticated: true,
        }))
      } else {
        console.info('signIn error:', res);
      }
    }).catch((err) => {

    });
  };
}