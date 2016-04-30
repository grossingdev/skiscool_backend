/**
 * Created by baebae on 4/30/16.
 */
import {has} from 'lodash';
import {log_console} from './log';
import io from 'socket.io-client/socket.io';
const SERVER = 'http://213.183.56.165:3700';
//admin user: admin_root_123

const options ={
  transports: ['websocket'],
  'force new connection': true
};

export class SocketClient {

  socketClient = null;
  deviceInfo = {};
  props = null;

  connect(props, deviceInfo) {
    this.props = props;
    this.deviceInfo = deviceInfo;

    if (this.socketClient != null) {
      this.registerDevice();
    } else {
      this.socketClient = io.connect(SERVER, options);
      this.registerEvent();
    }
  }

  registerEvent() {
    this.socketClient.on('connect', (data) => {
      log_console('connectToServer connected' + JSON.stringify(data));
      this.registerDevice();
    });

    // event handler for errors
    this.socketClient.on('error', (msg) => {
      log_console('error' + JSON.stringify(msg));
    });

    this.socketClient.on('register response', (msg) => {
      log_console('register response completed');
      this.props.setSocketClientConnected(true);
    });

    this.socketClient.on('show_devices', (data) => {
      this.props.updateSocketMessage({
        type: 'show_devices',
        data: data
      });
      this.props.setSocketClientConnected(true);
      log_console('show_devices' + JSON.stringify(data));
    })
  }

  disconnect() {
    if (this.socketClient) {
      this.socketClient.emit('disconnect', "");
      this.socketClient.disconnect();
      this.socketClient = null;
    }
    this.props.setSocketClientConnected(false);
  }

  registerDevice() {
    this.socketClient.emit('registerDevice', {
      uuid: this.deviceInfo.deviceID,
      username: this.deviceInfo.userName,
      location: this.deviceInfo.lat + "," + this.deviceInfo.lon
    });
  }

}
