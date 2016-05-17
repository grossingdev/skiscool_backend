/**
 * Created by baebae on 4/30/16.
 */
import {logConsole} from './log';


// let SERVER = 'http://ns327841.ip-37-187-112.eu:3700';
let SERVER = 'http://localhost:3700';

const options = {
  transports: ['websocket'],
  'force new connection': true
};

export class SocketClient {

  socketClient = null;
  deviceInfo = {};
  props = null;

  connect(props, deviceInfo, flagUpdate) {
    this.props = props;
    this.deviceInfo = deviceInfo;

    if (this.socketClient !== null && !flagUpdate) {
      this.disconnect();
    }
    if (!window.navigator.userAgent) {
      window.navigator.userAgent = 'skiscool';
    }
    let io = require('socket.io-client/socket.io');
    this.socketClient = io.connect(SERVER, options);
    this.registerEvent();
  }

  registerEvent() {
    this.socketClient.on('connect', (data) => {
      logConsole('connectToServer connected' + JSON.stringify(data));
      this.registerDevice();
    });

    // event handler for errors
    this.socketClient.on('error', (msg) => {
      logConsole('error' + JSON.stringify(msg));
    });

    this.socketClient.on('register response', (msg) => {
      logConsole('register response completed' + msg);
      this.props.setSocketClientConnected(true);
    });

    this.socketClient.on('show_devices', (data) => {
      this.props.updateSocketMessage({
        type: 'show_devices',
        data: data
      });
      this.props.setSocketClientConnected(true);
      logConsole('show_devices' + JSON.stringify(data));
    });
  }

  disconnect() {
    if (this.socketClient) {
      this.socketClient.emit('disconnect', '');
      this.socketClient.disconnect();
      this.socketClient = null;
    }
    this.props.setSocketClientConnected(false);
  }

  registerDevice() {
    this.socketClient.emit('registerDevice', {
      device_uuid: this.deviceInfo.deviceID,
      email: this.deviceInfo.email,
      location: [this.deviceInfo.lat, this.deviceInfo.lon],
      token: this.deviceInfo.token
    });
  }

}