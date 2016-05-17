/**
 * Created by baebae on 4/05/16.
 */

import {
  SET_MAP_MAKER_STYLE,
  ADD_PLACE_MARKER
} from '../actions/MapActions';

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
    default:
      return state;
  }
}