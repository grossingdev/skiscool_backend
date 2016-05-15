/**
 * Created by baebae on 4/5/16.
 */

import React, {AppRegistry, Component, NativeModules, View, Navigator, Text, InteractionManager} from 'react-native';
import Drawer from "react-native-drawer"
import {DefaultRenderer} from "react-native-router-flux";
import SidebarContent from './SidebarContent';

class SideDrawer extends React.Component {
  flagOpen = false;
  sideBar = null;

  openSidebar = () => {
    this.sideBar.close()
  };
  closeSidebar = () => {
    this.sideBar.open()
  };

  componentDidUpdate() {
    if (this.props.sidebarStatus == 1 || this.props.sidebarStatus == 2) {
      if (this.props.sidebarStatus == 1) {
        this.flagOpen = false;
      } else {
        this.flagOpen = !this.flagOpen ;
      }
      let component = this;
      InteractionManager.runAfterInteractions(() => {
        component.props.updateShowSidebar(0);
      });
    }

    if (this.flagOpen) {
      this.closeSidebar();
    } else {
      this.openSidebar();
    }
  }

  render() {
    const children = this.props.navigationState.children;
    return (
      <Drawer
        ref={(ref) => this.sideBar = ref}
        type="displace"
        content={<SidebarContent
        {...this.props}
        />}
        tapToClose={true}
        openDrawerOffset={0.4}
        panCloseMask={0.4}
        negotiatePan={true}
        tweenHandler={(ratio) => ({
                   main: { opacity:Math.max(0.54,1 - ratio) }
        })}>
        <DefaultRenderer navigationState={children[0]} />
      </Drawer>
    )
  }
}

import container from './container';

export default container(SideDrawer);