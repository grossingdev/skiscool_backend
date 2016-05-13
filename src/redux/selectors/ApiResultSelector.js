/**
 * Created by baebae on 4/30/16.
 */
import {createSelector} from 'reselect';

// account-wide selector
export const apiResult$ = (state) => state.apiResult;
export const apiResultSelector$ = createSelector(apiResult$,
  (apiResult) => ({
    apiResult
}));
