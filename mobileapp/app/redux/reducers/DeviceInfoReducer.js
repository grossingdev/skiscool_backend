/**
 * Created by baebae on 4/30/16.
 */
import {INITIALIZE_LOCATION, LOCATION_UPDATED, UPDATE_UUID} from '../actions/DeviceActions';
import defaultState from './defaultState';
export default function socketClient(state = defaultState.deviceInfo, action) {
  switch (action.type) {
    case INITIALIZE_LOCATION:
      return Object.assign({}, state, { initLoc: action.payload });
    case LOCATION_UPDATED:
      return Object.assign({}, state, { lastLoc: action.payload });
      return state;
    case UPDATE_UUID:
      return Object.assign({}, state, { uuid: action.payload });
      return state;
    default:
      return state;
  }
}
