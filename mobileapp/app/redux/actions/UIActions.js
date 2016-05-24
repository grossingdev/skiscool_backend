/**
 * Created by baebae on 4/5/16.
 */
import {log_console} from '../../utils/log';

// show/hide sidebar on navigation
export const updateShowSidebar = (value) => {
  return (dispatch) => {
    dispatch(updateSidebarStatus(value));
  }
};

// show/hide sidebar on navigation
export const showMapPackageConfirmDialog = (value) => {
  return (dispatch) => {
    dispatch(showMapPackageConfirmDialogAction(value));
  }
};

export const UPDATE_SIDEBAR_SHOW_STATUS = 'UPDATE_SIDEBAR_SHOW_STATUS';
const updateSidebarStatus = (status) => ({
  type: UPDATE_SIDEBAR_SHOW_STATUS,
  status
});

export const SHOW_MAP_PACKAGE_CONFIRM_DIALOG = 'SHOW_MAP_PACKAGE_CONFIRM_DIALOG';
const showMapPackageConfirmDialogAction = (show) => ({
  type: SHOW_MAP_PACKAGE_CONFIRM_DIALOG,
  show
});

export const UPDATE_API_WAITING_STATUS = 'UPDATE_API_LOADING_STATUS';
const updateAPILoadingStatusAction = (status) => ({
  type: UPDATE_API_WAITING_STATUS,
  status
});

// show/hide waiting status on UI
export const updateAPILoadingStatus = (status) => {
  return (dispatch) => {
    dispatch(updateAPILoadingStatusAction(status));
  }
};
