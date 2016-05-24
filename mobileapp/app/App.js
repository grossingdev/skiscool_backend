

/**
 * Created by baebae on 3/24/16.
 */
import React, {AppRegistry, Component, NativeModules, View, Navigator, Text, StatusBar, InteractionManager, Platform} from 'react-native';

window.navigator.userAgent = 'react-native';
var RNRF = require('react-native-router-flux');
import {Actions, Scene, Schema} from 'react-native-router-flux';
import {connect} from 'react-redux';
import DeviceInfo  from 'react-native-device-info';
import {isEqual} from 'lodash';
import request from 'superagent';
import {Switch} from 'react-native-router-flux';
import SidebarDrawer from './ui/component/sidebar/SidebarContainer';
import MapContainer from './ui/page/MapPage/MapContainer';
import Account from './ui/component/Login/Account';
import Info from './ui/page/InfoContainer';
import MapPicture from './ui/page/MapPicture';
import {SocketClient} from './utils/socket';

const Router = connect()(RNRF.Router);
const NOSWITCHER = true;

 class TabIcon extends React.Component {
    render(){
      return (
        <Text style={{color: this.props.selected ? "red" :"black"}}>{this.props.title}</Text>
      );
    }
}

class App extends Component {
  watchID = -1;
  socketClient = null;

  constructor() {
    super(); 
  }

  state = {
  }

  componentWillMount() {
    this.props.checkToken();
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
          this.props.initializeLocation(location);
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

    this.props.updateDeviceUUID(DeviceInfo.getUniqueID());

    navigator.geolocation.getCurrentPosition((initialPosition) => {
      this.props.initializeLocation(initialPosition);
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
      this.props.updateLocation(lastPosition);
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  renderContent() { 
    let image_resort="http://ns327841.ip-37-187-112.eu:8080/images/Val_Thorens.jpg";
    console.log(...this.props);
    return (
      <Router sceneStyle={{backgroundColor:'#F7F7F7'}}>
        <Scene
          key="root" hideNavBar={true} component={connect(state=>({user:state.user}))(Switch)} tabs={true}
          selector={(props) => ((NOSWITCHER)||(props.user.accessToken)) ? "sidebar" : "signUp"}>

          <Scene key="signUp" component={Account} {...this.props}/>

          <Scene key="sidebar" component={SidebarDrawer} >
            <Scene key="tabs" tabs={true} hideNavBar={true}>

              <Scene
                key="tab1" initial={true}  title="Tab #1" icon={TabIcon}
                navigationBarStyle={{backgroundColor:"red"}} titleStyle={{color:"white"}}>
                <Scene
                  key="mapPage" component={MapContainer}  title="Test Page"
                  hideNavBar={true} pageIndex={0} socketClient={this.socketClient} {...this.props}/>
              </Scene>

              <Scene key="tab2"  title="Plan" icon={TabIcon} navigationBarStyle={{backgroundColor:"blue"}} >
                <Scene
                  key="mapPage2" component={MapPicture} minimumZoomScale={0.4} maximumZoomScale={2}
                  source={{uri:image_resort}} title="MapPicture" hideNavBar={true} pageIndex={0}/>
              </Scene>

              <Scene key="tab3" title="Info" icon={TabIcon} navigationBarStyle={{backgroundColor:"green"}} >
                <Scene key="Info" component={Info}  title="Info" hideNavBar={true} pageIndex={0} {...this.props}/>
              </Scene>
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

import container from './container';
export default container(App);