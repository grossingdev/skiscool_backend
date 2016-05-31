/**
 * Created by baebae on 4/5/16.
 */
import React, {
  Dimensions,
  StyleSheet,
  View,
  Component,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import Button from 'react-native-button';

import {Actions} from 'react-native-router-flux';

import constant from '../../styles/constant';
import CreatePackageConfirm from './Dialogs/CreatePackageConfirm';
import WaitingProgress from '../../component/modal/Progressing';
import NavigationBar from '../../component/NavigationBar';

import MapPage from './MapPage';

import {isEqual} from 'lodash';

class MapContainer extends Component {
  state = {
    flagAdmin : false,
    styleURL: ''
  }
  componentDidMount() {
    setTimeout(()=> {
      this.props.getPlaceMarkers();
    }, 1000);
  }
  
  prepareMapPackage(flagAdmin) {
    if (this.props.user.token == '') {
      return;
    }

    if (flagAdmin == true && this.props.user.profile.flagAdmin != true) {
      return;
    }
    
    this.setState({flagAdmin});
    this.refs['mapPage'].getMapBoundary();
    this.props.showMapPackageConfirmDialog(true);
  }

  onCloseDialog() {
    this.props.showMapPackageConfirmDialog(false);
  }

  onConfirmDialog(title, region) {
    this.onCloseDialog();
    this.refs['mapPage'].saveMapBoxPackage(title, region, this.state.styleURL);
  }

  componentWillReceiveProps(nextProps) {
    let userToken = this.props.user.token || nextProps.user.token;
    if (userToken) {
      let styleURL = '';
      if (nextProps.user.profile.flagAdmin == true) {
        styleURL = 'http://ns327841.ip-37-187-112.eu:8080/2.json';
      } else {
        styleURL = 'http://ns327841.ip-37-187-112.eu:8080/1.json';
      }

      this.setState({styleURL});
      if (!isEqual(this.props.deviceInfo, nextProps.deviceInfo) || !isEqual(this.props.user, nextProps.user) ) {
        if (nextProps.deviceInfo.uuid != "" && nextProps.deviceInfo.initLoc.coords) {
          this.props.socketClient.connect(this.props, {
            deviceID: nextProps.deviceInfo.uuid,
            email: nextProps.user.profile.email,
            lat: nextProps.deviceInfo.initLoc.coords.latitude,
            lon: nextProps.deviceInfo.initLoc.coords.longitude,
            token: userToken
          })
        }
      }
    }
  }
  
  renderDialogs() {
    if (this.props.showPackageDialog) {
      let region = this.props.packageRegion;
      return (
        <CreatePackageConfirm
          isAdmin={this.state.flagAdmin}
          ref="confirmDialog"
          boundary={region}
          userProfile={this.props.user.profile}
          onCancel={()=>{this.onCloseDialog()}}
          onConfirm={(title, region)=>{this.onConfirmDialog(title, region)}}
        />
      )
    }
  }

  renderWaitingDialog() {
    if (this.props.packageRunning) {
      return (
        <WaitingProgress
          label={this.props.packageMessage}
        />
      )
    }
  }

  render() {
    console.log('PageContainer_render');
    return (
      <View style={styles.pageContainer}>
        <NavigationBar
          leftIcon={require('image!icon_menu')}
          centerIcon={require('image!icon_clipboard')}
          rightIcon={require('image!icon_verification')}
          onLeftPress={()=>{this.props.updateShowSidebar(2)}}
          onCenterPress={()=>{this.prepareMapPackage(false)}}
          onRightPress={()=>{this.prepareMapPackage(true)}}
        />
        {this.state.styleURL.length > 0 && <MapPage
          {...this.props}
          styleURL={this.state.styleURL}
          ref="mapPage"
        />}

        {this.renderDialogs()}
        {this.renderWaitingDialog()}

      </View>
    );
  }
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: constant.colors.navBackColor,
    paddingTop:20
  },
});

import container from './container';
export default container(MapContainer); 