/**
 * Created by baebae on 5/17/16.
 */

export const SET_MAP_MAKER_STYLE = 'SET_MAP_MAKER_STYLE';
const setMarkerStyle$ = (style) => ({
  type: SET_MAP_MAKER_STYLE,
  style
});

// marker icon style on sidebar
export const updateMarkerStyle = (style) => {
  return (dispatch) => {
    dispatch(setMarkerStyle$(style));
  }
};

export const ADD_PLACE_MARKER = 'ADD_PLACE_MARKER';
const addNewPlaceMarker$ = (marker) => ({
  type: ADD_PLACE_MARKER,
  marker
});

// add new marker
export const addNewPlaceMarker = (marker) => {
  return (dispatch) => {
    dispatch(addNewPlaceMarker$(marker));
  }
};

// remove marker
export const removePlaceMarker = (uuid) => {
  return (dispatch) => {
    dispatch(removePlaceMarker$(uuid));
  }
};

export const REMOVE_PLACE_MARKER = 'REMOVE_PLACE_MARKER';
const removePlaceMarker$ = (uuid) => ({
  type: REMOVE_PLACE_MARKER,
  uuid
});