/**
 * Created by baebae on 4/5/16.
 */
import {createSelector} from 'reselect';

// account-wide selector
export const sidebar$ = state => state.ui_status.sidebar;
export const pageIndex$ = state => state.ui_status.pageIndex;
export const showPackageDialog$ = state=> state.ui_status.showPackageDialog;
export const apiWaitingStatus$$ = state=> state.ui_status.apiWaitingStatus;

export const sidebarStatus$ = createSelector(sidebar$, (sidebarStatus) => {
  return {
    sidebarStatus
  }
});


export const apiWaitingStatus$ = createSelector(apiWaitingStatus$$, (apiWaitingStatus) => {
  return {
    apiWaitingStatus
  }
});

export const navPage$ = createSelector(pageIndex$, (pageIndex) => {
  return {
    pageIndex
  }
});