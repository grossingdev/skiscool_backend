require('./styles.css');

import React, { Component } from 'react';
import TextInput from 'common/input/TextInput';
const SERVER = 'http://localhost:3700';
import io from 'socket.io-client/socket.io';
import {log_console} from 'utils/log';
//admin user: admin_root_123
class TestDevice extends Component {
  state = {
    flagConnected: false,
    deviceID: "",
    userName: "",
    lat: "",
    lon: "",
    errorDeviceID: "",
    errorUserName: "",
    errorLocation: "",

    adminData: "",
  };

  socketClient = null;

  connectToServer() {
    debugger;
    if (this.socketClient != null) {
      this.registerDevice();
    } else {
      this.socketClient = io.connect(SERVER);
      this.registerEvent();
    }


  }

  registerDevice() {
    let errorDeviceID = "";
    let errorUserName = "";
    let errorLocation = "";

    if (this.state.deviceID == "") {
      errorDeviceID = "Required";
    }

    if (this.state.userName == "") {
      errorUserName = "Required";
    }

    if (this.state.lat == "" || this.state.lon == "" ) {
      errorLocation = "Required";
    }

    if (errorDeviceID.length > 0 || errorUserName.length > 0 || errorLocation.length > 0){
      this.setState({
        errorDeviceID,  errorUserName, errorLocation
      })
      return;
    }

    this.socketClient.emit('registerDevice', {
      uuid: this.state.deviceID,
      username: this.state.userName,
      location: this.state.lat + this.state.lon
    });
  }
  disconnectSever() {
    debugger;
    if (this.socketClient) {
      this.socketClient.emit('disconnect', "");
      this.socketClient.disconnect();
      this.socketClient = null;
      this.setState({
        flagConnected: false,
        adminData: ""
      })
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
      this.setState({
        flagConnected: true
      })
    });
    this.socketClient.on('show_devices', (data) => {
      this.setState({
        adminData: JSON.stringify(data)
      });
      this.setState({
        flagConnected: true
      })
      log_console('show_devices' + JSON.stringify(data));
    })
  }

  clearErrorText() {
    let errorDeviceID = "";
    let errorUserName = "";
    let errorLocation = "";
    this.setState({
      errorDeviceID,  errorUserName, errorLocation
    })
  }

  render() {
    return (
      <div className="TestDevice">

        <div className="itemArea">
          Device ID:
          <TextInput
            ref="deviceID"
            className="textInput"
            placeholder="Device UUID"
            errorText={this.state.errorDeviceID}
            onChange={(deviceID)=>{this.setState({deviceID}); this.clearErrorText()}}
            value={this.state.deviceID}
            readOnly={this.state.flagConnected}
          />
        </div>

        <div className="itemArea">
          User Name:
          <TextInput
            ref="username"
            className="textInput"
            placeholder="User Name"
            errorText={this.state.errorUserName}
            value={this.state.userName}
            onChange={(userName)=>{this.setState({userName});this.clearErrorText()}}
            readOnly={this.state.flagConnected}
          />
        </div>

        <div className="itemArea">
          Latitude:
          <TextInput
            ref="lat"
            className="textInput"
            placeholder="Latitude"
            errorText={this.state.errorLocation}
            onChange={(lat)=>{this.setState({lat});this.clearErrorText()}}
            value={this.state.lat}
          />

        </div>
        <div className="itemArea">
          Longitude:
          <TextInput
            ref="lon"
            className="textInput"
            placeholder="Longitude"
            errorText={this.state.errorLocation}
            onChange={(lon)=>{this.setState({lon});this.clearErrorText()}}
            value={this.state.lon}
          />

        </div>
        <div className="buttonArea">
          <div className="button btnConnect" onClick={()=>this.connectToServer()}>
            {this.state.flagConnected ? "Update": "Connect"}
          </div>
          {this.state.flagConnected && <div className="button btnDisconnect" onClick={()=>this.disconnectSever()}>Disconnect</div>}
        </div>
        {this.state.adminData}
      </div>
    );
  }
}

export default TestDevice;
