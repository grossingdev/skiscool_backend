/**
 * Created by baebae on 4/21/16.
 */
import React, {Component, Image, View, StyleSheet, Text, TouchableOpacity} from 'react-native';
const FBSDK = require('react-native-fbsdk');
const {
  LoginManager,
  } = FBSDK;

export default class ProfilePage extends Component {
  renderUserAvatar() {
    let user = this.props.user;
    if (user) {
      return (
        <View style={styles.imgContainer}>
          <Text style={styles.labelUser}>{user.profile.name.toUpperCase()}</Text>
        </View>
      )
    } else {
      return (
        <Text style={{ color: 'white', fontSize: 20}}>
          {this.props.title}
        </Text>
      );
    }
  }
  logout() {
    LoginManager.logOut();
    this.props.logout();
  }
  render() {
    return (
      <View style={styles.pageContainer}>
        <TouchableOpacity onPress={()=>this.logout()}>
          <Text style={styles.logoutText}>
            Log Out
          </Text>
        </TouchableOpacity>
        {this.renderUserAvatar()}
      </View>
    );
  }
}

let styles = StyleSheet.create({
  pageContainer: {
    flex: 1
  },
  imageUser: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 2,
  },
  imgContainer: {
    flex: 1,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelUser: {
    color: 'white',
    fontSize: 17,
    marginTop: 15
  },
  logoutText: {
    flex: 1,
    textAlign: 'right',
    marginRight: 10,
    color: 'gray'
  }
});