/**
 * Created by baebae on 4/20/16.
 */
import React, {Component, Image, View, StyleSheet, Text, TouchableOpacity} from 'react-native';

export default class NavigationBar extends Component {
  render() {
    return (
      <View style={styles.navBar}>
        <TouchableOpacity
          style={[styles.iconContainer, {marginLeft: 10}]}
          onPress={()=>{this.props.onLeftPress()}}
        >
          <Image style={styles.icon} source={this.props.leftIcon} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconContainer, {alignItems: 'center', width: 50}]}
          onPress={()=>{this.props.onCenterPress()}}
        >
          <Image style={styles.icon} source={this.props.centerIcon} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconContainer, {alignItems: 'flex-end', marginRight: 10}]}
          onPress={()=>{this.props.onRightPress()}}
        >
          <Image style={styles.icon} source={this.props.rightIcon} />
          <View style={styles.textContainer}>
            <Text style={styles.rightText}>12</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    backgroundColor: 'black',
    height: 35,
  },
  textContainer: {
    position: 'absolute',
    backgroundColor: '#7ED321',
    width: 18,
    height: 18,
    borderRadius: 9,
    right: 2,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightText: {
    backgroundColor: 'transparent',
  },

  iconContainer: {
    justifyContent: 'center',
    flex:1,
    marginTop: 5
  },
  icon: {
    width: 33,
    height: 28,
  },

});