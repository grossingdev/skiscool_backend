/**
 * Created by baebae on 4/21/16.
 */
import React, {Component, Image, View, StyleSheet, Text, TouchableOpacity, ActivityIndicatorIOS, TextInput, AlertIOS, Picker} from 'react-native';
const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
} = FBSDK;
const AccessToken = require('react-native').NativeModules.FBAccessToken;
const states = ['Instructor', 'Player'];

import PickerField from '../picker/PickerField';
export default class LoginPage extends Component {

  state = {
    pageType: 'login',
    email: "",
    password: "",
    confirmPassword: "",
    userType: ""
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
      } else if (stateName.length == 0) {
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
    let {userType} = this.state;
    if (userType.length > 0) {
      this.props.login({
        access_token,
        userType: userType.toLowerCase(),
        fromSocial: 'fb'
      });
    } else {
      AlertIOS.alert(
        'Error',
        'Please select user type.'
      );
    }

  }

  checkLoginField(password, email, userType) {
    let ret = {
      title: '',
      msg: ''
    }
    if (email.length == 0) {
      ret.title = 'Error';
      ret.msg = 'Email address is required.';
    } else if (password.length == 0) {
      ret.title = 'Error';
      ret.msg = 'User password is required';
    } else if (userType.length == 0) {
      ret.title = 'Error';
      ret.msg = 'User type is required';
    }
    return ret;
  }

  checkRegisterField(password, email, userType, confirmPassword) {
    let ret = this.checkLoginField(password, email, userType);
    if (ret.title.length > 0) {
      return ret;
    }
    if (confirmPassword.length == 0) {
      ret.title = 'Error';
      ret.msg = 'Confirm password is required';
    } else if (password != confirmPassword) {
      ret.title = 'Error';
      ret.msg = 'Confirm password is matched with password';
    }
    return ret;
  }

  loginUser() {
    if (this.state.pageType != 'login') {
      this.setState({
        pageType: 'login'
      })
    } else {
      let {password, email, userType} = this.state;
      let errorStatus = this.checkLoginField(password, email, userType);
      if (errorStatus.title.length == 0) {
        this.props.login({
          email: email.toLowerCase(),
          password,
          userType: userType.toLowerCase(),
          fromSocial: 'default'
        });
      } else {
        AlertIOS.alert(
          errorStatus.title, errorStatus.msg
        );
      }
    }

  }
  registerUser() {
    if (this.state.pageType != 'signup') {
      this.setState({
        pageType: 'signup'
      })
    } else {
      let {password, email, userType, confirmPassword} = this.state;
      let errorStatus = this.checkRegisterField(password, email, userType, confirmPassword);
      if (errorStatus.title.length == 0) {
        this.props.signIn({
          email: email.toLowerCase(),
          password,
          userType: userType.toLowerCase(),
          name: 'mobile user',
          age: 10,
          gender: 'Man',
          languages: ['en'],
          fromSocial: 'default'
        });
      } else {
        AlertIOS.alert(
          errorStatus.title, errorStatus.msg
        );
      }
    }
  }

  renderLoginView() {
    if (this.state.pageType == 'login') {
      return (
        <View style={styles.registerContainer}>
         
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            ref="user_name"
            placeholder="Email"
            value={this.state.email}
            onChangeText={(email)=>{this.setState({email})}}
          />
          <Text style={styles.label}>Password:</Text>
          <TextInput
            style={styles.input}
            ref="password"
            secureTextEntry={true}
            placeholder="password"
            value={this.state.password}
            onChangeText={(password)=>{this.setState({password})}}
          />
        </View>
      )
    }
  }
  renderRegisterView() {
    if (this.state.pageType == 'signup') {
      return (
        <View style={styles.registerContainer}>
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            ref="user_name"
            placeholder="Email"
            value={this.state.email}
            onChangeText={(email)=>{this.setState({email})}}
          />
          <Text style={styles.label}>Password:</Text>
          <TextInput
            style={styles.input}
            ref="password"
            secureTextEntry={true}
            placeholder="password"
            value={this.state.password}
            onChangeText={(password)=>{this.setState({password})}}
          />

          <Text style={styles.label}>Confirm Password:</Text>
          <TextInput
            style={styles.input}
            ref="confirm_password"
            secureTextEntry={true}
            placeholder="password"
            value={this.state.confirmPassword}
            onChangeText={(confirmPassword)=>{this.setState({confirmPassword})}}
          />
        </View>
      )
    }
  }
  renderAccountView() {
    return (
      <View style={styles.registerContainer}>
        {this.renderLoginView()}
        {this.renderRegisterView()}
        <View style={styles.buttonContainer}>

          <TouchableOpacity
            style={styles.button}
            onPress={()=>this.loginUser()}
          >
            <Text>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={()=>{this.registerUser()}}
          >
            <Text>Register</Text>
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
          <PickerField
            containerStyle={styles.userTypeSelect}
            placeholder="Select Type"
            value={this.state.userType}
            onValueChange={(userType) => this.setState({userType})}
            options={states}/>
          {this.renderAccountView()}
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
  },
  userTypeSelect: {
    marginTop: 10,
  }
});