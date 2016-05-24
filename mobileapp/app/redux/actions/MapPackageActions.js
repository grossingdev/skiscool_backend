/**
 * Created by baebae on 4/20/16.
 */
import {log_console} from '../../utils/log';

// set map region which is using in package
export const setMapPackageRegion = (region) => {
  return (dispatch) => {
    dispatch(setMapPackageRegionAction(region));
  }
};

export const SET_MAP_PACKAGE_REGION = 'SET_MAP_PACKAGE_REGION';
const setMapPackageRegionAction = (region) => ({
  type: SET_MAP_PACKAGE_REGION,
  region
});


// update package running status
export const updatePackageRunningStatus = (running) => {
  return (dispatch) => {
    dispatch(updatePackageRunningStatusAction(running));
  }
};

export const UPDATE_PACKAGE_RUNNING_STATUS = 'UPDATE_PACKAGE_RUNNING_STATUS';
const updatePackageRunningStatusAction = (running) => ({
  type: UPDATE_PACKAGE_RUNNING_STATUS,
  running
});

// update package progressing message
export const updatePackageStatusMessage = (message) => {
  return (dispatch) => {
    dispatch(updatePackageStatusMessageAction(message));
  }
};

export const UPDATE_PACKAGE_STATUS_MESSAGE = 'UPDATE_PACKAGE_STATUS_MESSAGE';
const updatePackageStatusMessageAction = (message) => ({
  type: UPDATE_PACKAGE_STATUS_MESSAGE,
  message
});