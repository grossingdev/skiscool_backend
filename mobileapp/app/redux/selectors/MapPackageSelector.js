/**
 * Created by baebae on 4/20/16.
 */

// account-wide selector
export const packageRegion$ = state => state.mapPackageInfo.region;
export const packageRunning$ = state => state.mapPackageInfo.running;
export const packageMessage$ = state=> state.mapPackageInfo.message;

