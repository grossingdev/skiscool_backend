/**
 * Created by BaeBae on 5/13/16.
 */
import { createAction } from 'redux-actions';
export const API_RESULT_CODE = 'API_RESULT_CODE';
export const apiResult$ = createAction(API_RESULT_CODE);

export const resetAPIResult = () => {
  return (dispatch) => {
    dispatch(apiResult$({
      error_code: 0,
      msg: ''
    }));
  };
}