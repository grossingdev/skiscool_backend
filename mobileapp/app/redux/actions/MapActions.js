/**
 * Created by baebae on 5/17/16.
 */
import API from '../../utils/api';

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
    API.map.addPlaceMarker(null, {marker}, dispatch)
      .then((res) => {
        if (res.success == true) {
          dispatch(addNewPlaceMarker$(marker));
        } else if (res.msg) {
          alert(res.msg)
        }
      });
  }
};

// remove marker
export const removePlaceMarker = (uuid) => {
  return (dispatch) => {
    API.map.removePlaceMarker(null, {uuid}, dispatch)
      .then((res) => {
        if (res.success == true) {
          dispatch(removePlaceMarker$(uuid));
        } else if (res.msg) {
          alert(res.msg)
        }
      });
  }
};

export const updatePlaceMarker = (marker) => {
  return (dispatch) => {
    API.map.updatePlaceMarker(null, marker, dispatch)
      .then((res) => {
        if (res.success == true) {
          dispatch(updatePlaceMarker$(marker));
        } else if (res.msg) {
          alert(res.msg)
        }
      });
  }
}

// get place markers
export const getPlaceMarkers = (range) => {
  return (dispatch) => {
    API.map.getPlaceMarkers(null, {range}, dispatch)
      .then((res) => {
        if (res.success == true) {
          dispatch(getPlaceMarkers$(res.data));
        } else if (res.msg) {
          alert(res.msg)
        }
      });
  }
};

// save boundary information
export const saveBoundary = (boundaryInfo) => {
  return (dispatch) => {
    API.map.saveBoundary(null, boundaryInfo, dispatch)
      .then((res) => {
        
      });
  }
};

export const REMOVE_PLACE_MARKER = 'REMOVE_PLACE_MARKER';
const removePlaceMarker$ = (overlay_uuid) => ({
  type: REMOVE_PLACE_MARKER,
  overlay_uuid
});

export const UPDATE_PLACE_MARKER = 'UPDATE_PLACE_MARKER';
const updatePlaceMarker$ = (marker) => ({
  type: UPDATE_PLACE_MARKER,
  marker
});
export const GET_PLACE_MARKERS = 'GET_PLACE_MARKERS';
const getPlaceMarkers$ = (placeMarkers) => ({
  type: GET_PLACE_MARKERS,
  placeMarkers
});