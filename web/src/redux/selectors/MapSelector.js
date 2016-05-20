/**
 * Created by baebae on 4/30/16.
 */
import {createSelector} from 'reselect';

// account-wide selector
export const markerStyle$ = (state) => state.map_status.markerStyle;
export const placeMarkers$ = (state) => state.map_status.placeMarkers;

export const mapStatusSelector$ = createSelector(markerStyle$,
  (markerStyle) => ({
    markerStyle
}));

export const placeMarkersSelector$ = createSelector(placeMarkers$,
  (placeMarkers) => ({
    placeMarkers
}));
