/**
 * Created by baebae on 4/05/16.
 */

import {
  SET_MAP_PACKAGE_REGION,
  UPDATE_PACKAGE_RUNNING_STATUS,
  UPDATE_PACKAGE_STATUS_MESSAGE
} from '../actions/MapPackageActions';
import defaultState from './defaultState';

export default function mapPackageInfo (state = defaultState.mapPackageInfo, action) {
  switch (action.type) {

    case SET_MAP_PACKAGE_REGION:
      return Object.assign({}, state, {
        region: action.region,
      });
    case UPDATE_PACKAGE_RUNNING_STATUS:
      return Object.assign({}, state, {
        running: action.running,
      });
    case UPDATE_PACKAGE_STATUS_MESSAGE:
      return Object.assign({}, state, {
        message: action.message,
      });

    default:
      return state;
  }
}