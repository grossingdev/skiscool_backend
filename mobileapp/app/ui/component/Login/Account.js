/**
 * Created by baebae on 4/21/16.
 */
 //parent sidebarcontent
import React, {Component, Image, View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import LoginPage from './LoginPage';
import ProfilePage from './ProfilePage';
import WaitingProgress from '../modal/Progressing';
class AccountContainer extends Component {

  renderAccountPage() {
    let flagLogin = false;
    let {profile} = this.props.user;
    if (profile.name && this.props.user.token.length > 0) {
      flagLogin = true;
    }
    if (flagLogin == false) {
      return (
        <LoginPage
          {...this.props}
        />
      )
    } else {
      return (
        <ProfilePage
          {...this.props}
        />
      )
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderAccountPage()}
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default AccountContainer;