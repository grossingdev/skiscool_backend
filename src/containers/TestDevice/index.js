import React, { Component, PropTypes} from 'react';
import TextInput from 'components/common/input/TextInput';
import container from './container';
import request from 'superagent';
class TestDevice extends Component {
  static propTypes = {
    socketClient: PropTypes.object.isRequired,
    socketConnected: PropTypes.bool,
    socketMessage: PropTypes.object
  };

  state = {
    deviceID: '',
    userName: '',
    lat: '',
    lon: '',
    errorDeviceID: '',
    errorUserName: '',
    errorLocation: '',
  };

  getIPLocation() {
    request('GET', 'http://ipinfo.io')
      .accept('application/json')
      .end((err, res) => {
        if (!err) {
          const location = JSON.parse(res.text);
          const locs = location.loc.split(',');
          this.setState({
            lat: locs[0],
            lon: locs[1]
          });
        }
      });
  };

  componentDidMount() {
    this.getIPLocation();
  }

  clearErrorText() {
    const errorDeviceID = '';
    const errorUserName = '';
    const errorLocation = '';
    this.setState({
      errorDeviceID, errorUserName, errorLocation
    })
  }

  disconnectSever() {
    this.props.socketClient.disconnect();
  }

  connectToServer() {
    let errorDeviceID = '';
    let errorUserName = '';
    let errorLocation = '';

    if (this.state.deviceID === '') {
      errorDeviceID = 'Required';
    }

    if (this.state.userName === '') {
      errorUserName = 'Required';
    }

    if (this.state.lat === '' || this.state.lon === '' ) {
      errorLocation = 'Required';
    }

    if (errorDeviceID.length > 0 || errorUserName.length > 0 || errorLocation.length > 0){
      this.setState({
        errorDeviceID, errorUserName, errorLocation
      });
      return;
    }

    this.props.socketClient.connect(this.props, this.state);
  }

  render() {
    const styles = require('./styles.scss');
    return (
      <div className={styles.TestDevice}>

        <div className={styles.itemArea}>
          Device ID:
          <TextInput
            ref='deviceID'
            className={styles.textInput}
            placeholder='Device UUID'
            errorText={this.state.errorDeviceID}
            onChange={(deviceID)=>{this.setState({deviceID}); this.clearErrorText()}}
            value={this.state.deviceID}
            readOnly={this.props.socketConnected}
          />
        </div>

        <div className={styles.itemArea}>
          User Name:
          <TextInput
            ref='username'
            className={styles.textInput}
            placeholder='User Name'
            errorText={this.state.errorUserName}
            value={this.state.userName}
            onChange={(userName)=>{this.setState({userName});this.clearErrorText()}}
            readOnly={this.props.socketConnected}
          />
        </div>

        <div className={styles.itemArea}>
          Latitude:
          <TextInput
            ref='lat'
            className={styles.textInput}
            placeholder='Latitude'
            errorText={this.state.errorLocation}
            onChange={(lat)=>{this.setState({lat});this.clearErrorText()}}
            value={this.state.lat}
          />

        </div>
        <div className={styles.itemArea}>
          Longitude:
          <TextInput
            ref='lon'
            className={styles.textInput}
            placeholder='Longitude'
            errorText={this.state.errorLocation}
            onChange={(lon)=>{this.setState({lon});this.clearErrorText()}}
            value={this.state.lon}
          />

        </div>
        <div className={styles.buttonArea}>
          <div className={styles.button + ' ' + styles.btnConnect} onClick={()=>this.connectToServer()}>
            {this.props.socketConnected ? 'Update': 'Connect'}
          </div>
          {this.props.socketConnected && <div className={styles.button + ' ' + styles.btnDisconnect} onClick={()=>this.disconnectSever()}>Disconnect</div>}
        </div>
        {this.props.socketMessage.type + this.props.socketMessage.data}
      </div>
    );
  }
}

export default container(TestDevice);
