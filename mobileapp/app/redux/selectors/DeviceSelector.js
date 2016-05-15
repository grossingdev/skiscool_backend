/**
 * Created by baebae on 4/30/16.
 */
import {createSelector} from 'reselect';

// account-wide selector
export const deviceInfo$ = (state) => state.deviceInfo;
export const deviceInfoSelector$ = createSelector(deviceInfo$,
  (deviceInfo) => ({
    deviceInfo
}));
