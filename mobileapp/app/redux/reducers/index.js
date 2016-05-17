/**
 * Created by baebae on 3/24/16.
 */
import {combineReducers} from 'redux';
import ui_status from './UIReducer';
import mapPackageInfo from './MapPackageReducer';
import user from './UserReducer';
import socketClient from './SocketReducer';
import deviceInfo from './DeviceInfoReducer';
import apiResult from './ApiResultReducer';

export default combineReducers({
  ui_status, mapPackageInfo, user, socketClient, deviceInfo, apiResult
});