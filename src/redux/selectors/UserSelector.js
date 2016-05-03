/**
 * Created by baebae on 4/30/16.
 */
import {createSelector} from 'reselect';

// account-wide selector
export const user$ = (state) => state.user;
export const userSelector$ = createSelector(user$,
  (user) => ({
    user
}));
