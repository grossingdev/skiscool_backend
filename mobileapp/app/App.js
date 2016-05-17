/**
 * Created by baebae on 3/24/16.
 */
import React, {AppRegistry, Component, NativeModules, View, Navigator, Text, StatusBar, InteractionManager, Platform} from 'react-native';

window.navigator.userAgent = 'react-native';
var RNRF = require('react-native-router-flux');
import {Actions, Scene, Schema} from 'react-native-router-flux';
import {connect} from 'react-redux';
import DeviceInfo  from 'react-native-device-info';


import SidebarDrawer from './ui/component/sidebar/Sidebar';
import MapPageContainer from './ui/page/MapPage/PageContainer';
const Router = connect()(RNRF.Router);

import {isEqual} from 'lodash';
import {SocketClient} from './utils/socket';

import {checkToken} from './redux/actions/UserActions';
import {updateLocation, initializeLocation, updateDeviceUUID} from './redux/actions/DeviceActions';
import request from 'superagent';

class App extends Component {
  watchID = -1;
  socketClient = null;

  constructor() {
    super();
  }

  componentWillMount() {
    this.props.dispatch(checkToken());
    if (this.socketClient == null) {
      this.socketClient = new SocketClient();
    }
  }

  getIPLocation(){
    request('GET', 'http://ipinfo.io')
      .accept('application/json')
      .end((err, res) => {
        if (!err) {
          let resObject = JSON.parse(res.text);
          let locs = resObject.loc.split(",");
          let location = {
            coords: {
              latitude: locs[0],
              longitude: locs[1]
            }
          }
          this.props.dispatch(initializeLocation(location));
        }
      });
  };

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  componentDidMount() {
    if (Platform.OS === 'ios') {
      setTimeout(() => StatusBar.setBarStyle('light-content'));
    }

    this.props.dispatch(updateDeviceUUID(DeviceInfo.getUniqueID()));

    navigator.geolocation.getCurrentPosition((initialPosition) => {
      this.props.dispatch(initializeLocation(initialPosition));
      }, (error) => {
        alert("Problem on get location from gps, will use ip location instead");
        this.getIPLocation();
      }, {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000
      }
    );
    this.watchID = navigator.geolocation.watchPosition((lastPosition) => {
      this.props.dispatch(updateLocation(lastPosition));
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  renderContent() {
    return (
      <Router sceneStyle={{backgroundColor:'#F7F7F7'}}>
        <Scene key="root" hideNavBar={true} >
          <Scene key="sidebar" component={SidebarDrawer} >
              <Scene key="testPageRouter">
                <Scene key="mapPage" component={MapPageContainer} title="Test Page" hideNavBar={true} pageIndex={0} socketClient={this.socketClient}/>
              </Scene>
          </Scene>
        </Scene>
      </Router>
    );
  }

  render() {
    return (
      <View style={{flex: 1}}>
        {this.renderContent()}
      </View>
    );
  }
}

export default connect()(App);