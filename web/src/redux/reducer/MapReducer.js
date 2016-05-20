/**
 * Created by baebae on 4/05/16.
 */

import {
  SET_MAP_MAKER_STYLE,
  ADD_PLACE_MARKER,
  REMOVE_PLACE_MARKER,
  GET_PLACE_MARKERS
} from '../actions/MapActions';
import _ from 'lodash';
import defaultState from './defaultState';
export default function mapReducer (state = defaultState.map_status, action) {
  switch (action.type) {

    case SET_MAP_MAKER_STYLE:
      return Object.assign({}, state, {
        markerStyle: action.style,
      });

    case ADD_PLACE_MARKER:
      let placeMarkers = state.placeMarkers.slice();
      placeMarkers.push(action.marker);
      return Object.assign({}, state, {
        placeMarkers: placeMarkers
      });

    case REMOVE_PLACE_MARKER:
      let index = 0;
      let findIndex = 0;
      let rPlaceMarkers = state.placeMarkers.slice();
      _.forEach(state.placeMarkers, (item)=>{
        if (item.overlay_uuid == action.overlay_uuid) {
          findIndex = index;
        }
        index ++;
      });
      rPlaceMarkers.splice(findIndex, 1);
      return Object.assign({}, state, {
        placeMarkers: rPlaceMarkers
      });
      break;
    case GET_PLACE_MARKERS:
      return Object.assign({}, state, {
        placeMarkers: action.placeMarkers,
      });

      break;
    default:
      return state;
  }
}