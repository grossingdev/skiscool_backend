/**
 * Created by baebae on 4/30/16.
 */
import defaultState from './defaultState';
import {API_RESULT_CODE} from '../actions/APIResultActions';

export default function apiResult(state = defaultState.apiResult, action) {
  switch (action.type) {
    case API_RESULT_CODE:
      return Object.assign({}, state, {
        error_code: action.payload.error_code,
        msg: action.payload.msg
      });
    default:
      return state;
  }
}
