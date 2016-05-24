/**
 * Created by baebae on 4/21/16.
 */
import React, {Component, Image, View, StyleSheet, Text, TouchableOpacity, ActivityIndicatorIOS, TextInput,AlertIOS} from 'react-native';
const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
} = FBSDK;
const AccessToken = require('react-native').NativeModules.FBAccessToken;

export default class LoginPage extends Component {

  state = {
    email: "",
    password: ""
  }

  componentWillReceiveProps(nextProps) {
    let {apiResult} = nextProps;
    if (apiResult && apiResult.msg && apiResult.msg.length > 0) {
      let stateName = '';
      switch (apiResult.error_code) {
        case 1000:
        case 1010:
        case 1014:
          stateName = 'username_error_text';
          break;
        case 1004:
          stateName = 'language_error_text';
          break;
        case 1001:
        case 1011:
        case 1012:
          stateName = 'email_error_text';
          break;
        case 1002:
        case 1013:
          stateName = 'password_error_text';
          break;
        case 1003:
          stateName = 'age_error_text';
          break;
      }
      if (stateName.length > 0) {
        let state = {};
        state[stateName] = apiResult.msg;
        alert(state[stateName]);
      }
      if (apiResult.error_code == 0) {
        alert(apiResult.msg);
      }
      this.props.resetAPIResult();
    }

  }

  _getAccessToken() {
    let component = this;
    AccessToken.getCurrentAccessToken((tokenMap) => {
      if (tokenMap) {
        component.onFacebookLogin(tokenMap.accessToken);
      } else {

      }
    });
  }

  onFacebookLogin(access_token) {
    let userType = 'Player';
    this.props.login({
      access_token,
      userType: userType.toLowerCase(),
      fromSocial: 'fb'
    });
  }
  

  registerUser(flagRegister) {
    let userType = 'Player';
    let {password, email} = this.state;
    if (password.length > 0 && email.length > 0) {
      if (flagRegister) {
        this.props.registerUser(this.state.email, this.state.password);
      } else {
        this.props.login({
          email: email.toLowerCase(),
          password,
          userType: userType.toLowerCase(),
          fromSocial: 'default'
        });
      }

    } else {
      AlertIOS.alert(
        'Error',
        'Please input user information.'
      );
    }
  }
  loginUser() {
    
  }
  renderRegisterView() {
    return (
      <View style={styles.registerContainer}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          ref="user_name"
          placeholder="Email"
          value={this.state.email}
          onChangeText={(email)=>{this.setState({email})}}
        ></TextInput>
        <Text style={styles.label}>Password:</Text>
        <TextInput
          style={styles.input}
          ref="password"
          secureTextEntry={true}
          placeholder="password"
          value={this.state.password}
          onChangeText={(password)=>{this.setState({password})}}
        ></TextInput>

        <View style={styles.buttonContainer}>

          <TouchableOpacity
            style={styles.button}
            onPress={()=>this.registerUser(false)}
          >
            <Text>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  render() {
    let {apiWaitingStatus} = this.props;
    if (apiWaitingStatus) {
      return (
        <View style={styles.container}>
          <ActivityIndicatorIOS color="#FFFFFF"/>
          <Text style={styles.waitingLabel}>Waiting to login</Text>
        </View>
      )
    } else {
      return (
        <View style={styles.container}>
          <LoginButton
            readPermissions={["email"]}
            onLoginFinished={
              (error, result) => {
                if (error) {
                  alert("login has error: " + result.error);
                } else if (result.isCancelled) {
                  alert("login is cancelled.");
                } else {
                  this._getAccessToken();
                }
              }
            }
            onLogoutFinished={() => alert("logout.")}/>

          {this.renderRegisterView()}
        </View>
      );
    }
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerContainer: {
    marginTop: 10,
    flex: 1,
    alignSelf: 'stretch',
  },
  input: {
    marginTop: 5,
    marginBottom: 10,
    marginRight: 20,
    backgroundColor: '#FEFEFE',
    height: 30,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    backgroundColor: '#CCCCCC',
    marginRight: 20,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  label: {
    color: 'white',
  },
  waitingLabel: {
    marginTop: 10,
    color: 'white'
  }
});