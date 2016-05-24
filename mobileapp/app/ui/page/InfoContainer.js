import React, {
  Dimensions,
  StyleSheet,
  View,
  Component,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';

import Swiper from 'react-native-page-swiper';
import Page1 from './Page1';
import Page2 from './Page2';
import Page3 from './Page3';     

import NavigationBar from '../component/NavigationBar';
import constant from '../styles/constant';

var InfoContainer = React.createClass({

  render() {
  console.log('Info_render'); 
    return (
      <View style={styles.pageContainer}>
    <NavigationBar
          leftIcon={require('image!icon_menu')}
          centerIcon={require('image!icon_clipboard')}
          rightIcon={require('image!icon_verification')}
          onLeftPress={()=>{this.props.updateShowSidebar(2)}}
          onCenterPress={()=>{
          //previous page
          
           }}
          onRightPress={()=>{
          //next page
          }}
        />
        <Swiper style={styles.wrapper}>
			<Page1/>
          <Page2/>
          <Page3/>
        </Swiper>
     </View>
        )}
        
        });
        
const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: constant.colors.navBackColor,
    paddingTop:20
  },
  wrapper: {
    flex: 1,
    marginTop: 5,
    backgroundColor: '#797676',
  },
});


export default InfoContainer; 