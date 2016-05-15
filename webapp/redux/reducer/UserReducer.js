/**
 * Created by baebae on 4/30/16.
 */
import defaultState from './defaultState';
import * as User from '../actions/UserActions';

export default function user(state = defaultState.user, action) {
  switch (action.type) {
    case User.LOGIN:
      return Object.assign({}, state, {
        auth: action.payload.authenticated,
        token: action.payload.token,
        profile: action.payload.profile
      });
    default:
      return state;
  }
}
