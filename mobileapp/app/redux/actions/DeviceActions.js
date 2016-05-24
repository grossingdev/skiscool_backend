/**
 * Created by baebae on 4/30/16.
 */
import { createAction } from 'redux-actions';
export const LOCATION_UPDATED = 'LOCATION_UPDATED';
export const updateLocation$ = createAction(LOCATION_UPDATED);

export const INITIALIZE_LOCATION = 'INITIALIZE_LOCATION';
export const initializeLocation$ = createAction(INITIALIZE_LOCATION);

export const UPDATE_UUID = "UPDATE_UUID";
export const updateDeviceUUID$ = createAction(UPDATE_UUID);


export const updateLocation = (loc) => {
  return (dispatch) => {
    dispatch(updateLocation$(loc));
  };
};

export const initializeLocation = (loc) => {
  return (dispatch) => {
    dispatch(initializeLocation$(loc));
  };
}

export const updateDeviceUUID = (uuid) => {
  return (dispatch) => {
    dispatch(updateDeviceUUID$(uuid));
  };
}
