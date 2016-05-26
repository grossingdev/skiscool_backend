/**
 * Created by baebae on 4/30/16.
 */
import logConsole from './log';

let config = require('../config');

let SERVER = 'http://ns327841.ip-37-187-112.eu:3700';
if (config.isProduction) {
  SERVER = 'http://ns327841.ip-37-187-112.eu:3700';
} else {
  SERVER = 'http://localhost:3700';
}

const options = {
  transports: ['websocket'],
  path: '/ws',
  'force new connection': true
};

export class SocketClient {

  socketClient = null;
  deviceInfo = {};
  props = null;

  connect(props, deviceInfo, flagUpdate) {
    this.props = props;
    this.deviceInfo = deviceInfo;

    // if (this.socketClient !== null && !flagUpdate) {
    //   this.disconnect();
    // }
    // if (!window.navigator.userAgent) {
    //   window.navigator.userAgent = 'skiscool';
    // }
    // if (!__CLIENT__){
    //   console.log('server');
    //   let io = require('socket.io-client');
    //   this.socketClient = io.connect(SERVER, options);
    //   this.registerEvent();
    // } else{
    //   console.log('client');
    //   if (typeof(io)!=='undefined'){
    //     console.log('yes');
    //     this.socketClient = io.connect(SERVER, options);
    //     this.registerEvent();
    //   } else{console.log('no');
    //  // var io = require('socket.io-client');
    //  // this.socketClient = io.connect(SERVER, options);
    //  // this.registerEvent();
    //   }
    // }

    if (this.socketClient === null || !flagUpdate) {
      this.disconnect();
      let sockjs_url = SERVER + '/device';
      let sockJS = require('sockjs-client');
      this.socketClient = new sockJS(sockjs_url);
      this.registerEventSockJS();
    } else if (this.socketClient !== null) {
      this.registerDevice();
    }
  }

  registerEventSocketIO() {
    // this.socketClient.on('open', (data) => {
    //   logConsole('connectToServer connected' + JSON.stringify(data));
    //   this.registerDevice();
    // });
    //
    // // event handler for errors
    // this.socketClient.on('error', (msg) => {
    //   logConsole('error' + JSON.stringify(msg));
    // });
    //
    // this.socketClient.on('register response', (msg) => {
    //   logConsole('register response completed' + msg);
    //   this.props.setSocketClientConnected(true);
    // });
    //
    // this.socketClient.on('show_devices', (data) => {
    //   this.props.updateSocketMessage({
    //     type: 'show_devices',
    //     data: data
    //   });
    //   this.props.setSocketClientConnected(true);
    //   logConsole('show_devices' + JSON.stringify(data));
    // });
  }

  registerEventSockJS() {
    this.socketClient.onopen = () => {
      logConsole('connectToServer connected');
      this.registerDevice();
    };

    this.socketClient.onmessage = (message) => {
      let e = JSON.parse(message.data);

      if (e.method == 'error') {
        logConsole('error' + JSON.stringify(e.data));
      } else if (e.method == 'register response') {
        logConsole('register response completed' + e.data);
        this.props.setSocketClientConnected(true);
      } else if (e.method == 'show_devices') {
        this.props.updateSocketMessage({
          type: 'show_devices',
          data: e.data
        });
        this.props.setSocketClientConnected(true);
        logConsole('show_devices' + JSON.stringify(e.data));
      }
    };

    this.socketClient.onclose = () => {
      logConsole('connectToServer closed');
    };

  }

  // disconnectSocketIO() {
  //   if (this.socketClient) {
  //     this.socketClient.emit('disconnect', '');
  //     this.socketClient.disconnect();
  //     this.socketClient = null;
  //   }
  //   this.props.setSocketClientConnected(false);
  // }

  disconnect() {
    if (this.socketClient) {
      this.socketClient.close();
      this.socketClient = null;
    }
    this.props.setSocketClientConnected(false);
  }

  registerDevice() {
    let data = {
      method: 'registerDevice',
      data: {
        device_uuid: this.deviceInfo.deviceID,
        email: this.deviceInfo.email,
        location: [this.deviceInfo.lat, this.deviceInfo.lon],
        token: this.deviceInfo.token
      }
    };

    this.socketClient.send(JSON.stringify(data));
  }

}
