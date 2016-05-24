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

var MapContainer = React.createClass({

  removeAllPackage() {
    this.refs['mapPage'].removeAllMapPackages();
  },

  prepareMapPackage() {
    this.refs['mapPage'].prepareMapPackage();
    this.props.showMapPackageConfirmDialog(true);
  },

  onCloseDialog() {
    this.props.showMapPackageConfirmDialog(false);
  },

  onConfirmDialog(title) {
    this.onCloseDialog();
    this.refs['mapPage'].saveAdminMapPackage(title, this.props.packageRegion);
  },

  componentWillReceiveProps(nextProps) {
    let userToken = this.props.user.token || nextProps.user.token;
    if (userToken) {
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
  },
  
  renderDialogs() {
    if (this.props.showPackageDialog) {
      let region = this.props.packageRegion;
      let message = region.sw_lat.toFixed(4) + ", " + region.sw_lon.toFixed(4) + ", " + region.ne_lat.toFixed(4) + ", " + region.ne_lon.toFixed(4);
      return (
        <CreatePackageConfirm
          ref="confirmDialog"
          title="Add Offline Package"
          message="Choose a name for the package:"
          message1={"region: " + message}
          placeholder="Input Package name"
          onCancel={()=>{this.onCloseDialog()}}
          onConfirm={(title)=>{this.onConfirmDialog(title)}}
        />
      )
    }
  },

  renderWaitingDialog() {
    if (this.props.packageRunning) {
      return (
        <WaitingProgress
          label={this.props.packageMessage}
        />
      )
    }
  },

  render() {
  console.log('PageContainer_render'); 
    return (
      <View style={styles.pageContainer}>
        <NavigationBar
          leftIcon={require('image!icon_menu')}
          centerIcon={require('image!icon_clipboard')}
          rightIcon={require('image!icon_verification')}
          onLeftPress={()=>{this.props.updateShowSidebar(2)}}
          onCenterPress={()=>{this.prepareMapPackage()}}
          onRightPress={()=>{this.removeAllPackage()}}
        />
          <MapPage
            {...this.props}
            ref="mapPage"
          />
        {this.renderDialogs()}
        {this.renderWaitingDialog()}

      </View>
    );
  }
});

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: constant.colors.navBackColor,
    paddingTop:20
  },
});

import container from './container';
export default container(MapContainer); 