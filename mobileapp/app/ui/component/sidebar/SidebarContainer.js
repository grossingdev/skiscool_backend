/**
 * Created by baebae on 4/5/16.
 */
 
import React, {AppRegistry, Component, NativeModules,StyleSheet, View, Navigator, Text, InteractionManager} from 'react-native';
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
      console.log(this.flagOpen);
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
    const drawerStyles = StyleSheet.create({
  drawer: { shadowColor: '#af0ff0', shadowOpacity: 0.8, shadowRadius: 3},
  main: {paddingLeft: 0},
})
console.log('rendersidebar');
    return (
      <Drawer
        ref={(ref) => this.sideBar = ref}
        type="displace"
        content={<SidebarContent
        {...this.props}
        />} 
        tapToClose={true}
        initializeOpen={false}
        openDrawerOffset={0.5}
        negotiatePan={true}
		tweenHandler={Drawer.tweenPresets.parallax}>
        <DefaultRenderer navigationState={children[0]} onNavigate={this.props.onNavigate}/>
      </Drawer>
    )
  }
}

import container from './container';
export default container(SideDrawer);