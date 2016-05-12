/** @flow */


import React, { Component, PropTypes } from 'react';

import container from './container';
import Button from 'components/common/button';
import TextInput from 'components/common/input/TextInput';
import AutoTextComplete from 'components/common/input/AutoTextComplete';
import FacebookButton from 'components/common/button/Facebook';
import Copy from 'utils/copy';
import {has} from 'lodash';
import Api from 'utils/api';
class LoginForm extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  state = {
    username_error_text: '',
    password_error_text: '',
    email_error_text: '',
    gender: Copy.values.genders[0],
    userType: Copy.values.userTypes[0],
    selectedLanguage: ''
  };

  componentWillReceiveProps(nextProps) {
    let error = nextProps.error;
    if (error) {
      switch(error.status) {
        case 'email_or_username_not_found':
          if (has(error, 'errors')) {
            this.setState({
              username_error_text: error.errors.join('.\n')
            });
          }
          break;
        default:
          console.log('error', error);
          if (has(error, 'errors')) {
            this.setState({
              password_error_text: error.errors.join('.\n')
            });
          }
      }
    }
  }

  checkSignupParam() {
    let userName = this.refs.username.getText();
    let email = this.refs.email.getText();
    let password = this.refs.password.getText();

    this.setState({
      username_error_text: userName ? '' : Copy.common.required,
      email_error_text: email ? '' : Copy.common.required,
      password_error_text: password ? '' : Copy.common.required
    });

    if (userName && email && password) {
      this.props.signIn({
        userName,
        email,
        password,
        fromSocial: 'default'
      });
    }
  }

  checkLoginParam() {
    let username = this.refs.username.getText();
    let password = this.refs.password.getText();

    this.setState({
      username_error_text: username ? '' : Copy.common.required,
      password_error_text: password ? '' : Copy.common.required
    });

    if (username && password) {
      this.props.login({
        username,
        password,
        fromSocial: 'default'
      });
    }
  }
  switchView() {
    this.setState({
      username_error_text: '',
      password_error_text: '',
      email_error_text: '',
      email_error_gender: '',
    });
    this.refs.username.clearText();
    this.refs.password.clearText();

    if (this.props.pageType == "loginPage") {
      this.context.router.replace('/signup');
    } else if (this.props.pageType == "signupPage"){
      this.refs.email.clearText();
      this.context.router.replace('/login');
    }
  };
  renderLoginPage(styles) {
    let loginWithFacebook = (response) => {
    };

    return (
      <div className={styles.LoginForm}>

        <div className={styles.FormContainer}>
          <div className={styles.Label1}>{Copy.login.header}</div>
          <div className={styles.LabelArea2}>
            <Button type="label" className={styles.Label3 + ' ' + styles.left } onClick={()=> this.switchView()}>
              {Copy.login.not_signed_in}
            </Button>
          </div>
        </div>

        <div className={styles.ComponentArea}>
          <TextInput
            ref= "username"
            placeholder="Username/Email"
            errorText={this.state.username_error_text}
          />
          <TextInput
            ref= "password"
            placeholder="Password"
            type="password"
            errorText={this.state.password_error_text}
          />

          <div className={styles.TextInput}></div>
          <div className={styles.terms_policy}>
            Forgot your &nbsp;
            <Button className={styles.underline} type="label">username</Button>
            &nbsp;or &nbsp;
            <Button className={styles.underline} type="label">password</Button>.
          </div>

          <Button className={styles.btnSignUp} onClick={()=>this.checkLoginParam()}>{Copy.login.buttonText}</Button>
          <FacebookButton
            className={styles.btnFacebook}
            appId="562112907171338"
            icon="fa-facebook-square"
            autoLoad={false}
            size="medium"
            textButton="Log in with Facebook"
            callback={loginWithFacebook} />
        </div>

      </div>
    );
  }

  renderSignupPage(styles) {
    let signupWithFacebook = (result) => {

    };
    return (
      <div className={styles.LoginForm + ' ' + styles.SignForm}>
        <div className={styles.FormContainer}>
          <div className={styles.Label1}>{Copy.signup.header}</div>
          <div className={styles.LabelArea2}>
            <div className={styles.Label2}>Already have an account?</div>
            <Button type="label" className={styles.Label3} onClick={()=> this.switchView()}>
              {Copy.login.buttonText}
            </Button>
          </div>
        </div>

        <div className={styles.ComponentArea}>
          <div className={styles.rowContainer}>
            <div className={styles.selectArea + ' ' + styles.userTypeArea}>
              <div className={styles.labelFormField}>{Copy.values.typeUser}</div>
              <AutoTextComplete
                className={styles.selectList}
                onSelect={(userType) => this.setState({userType})}
                value={this.state.userType}
                items={Copy.values.userTypes}
                renderItem={(item)=>{return <div key={item} className={styles.optionItem}>{item}</div>}}
              />
            </div>
          </div>

          <TextInput ref= "username" placeholder="Username" errorText={this.state.username_error_text}></TextInput>
          <TextInput ref= "email" placeholder="Email" errorText={this.state.email_error_text}></TextInput>
          <TextInput ref= "password" placeholder="Password" type="password" errorText={this.state.password_error_text}></TextInput>

          <div className={styles.rowContainer}>
            <TextInput ref= "age" placeholder="Age" type="num" errorText={this.state.password_error_text} />
            <div className={styles.selectArea}>
              <div className={styles.labelFormField}>{Copy.values.typeGender}</div>
              <AutoTextComplete
                className={styles.selectList}
                onSelect={(gender) => this.setState({gender})}
                value={this.state.gender}
                items={Copy.values.genders}
                renderItem={(item)=> {return <div key={item} className={styles.optionItem}>{item}</div>}}
              />
            </div>
          </div>

          <div className={styles.rowContainer}>
            <TextInput ref= "language" placeholder="Languages" readOnly={true}></TextInput>
            <div className={styles.btnDelete} onClick={()=>{this.clearLanguages()}}>
              <img src="/icons/default/delete_button.svg" />
            </div>

            <div className={styles.selectArea + ' ' + styles.languageArea}>
              <AutoTextComplete
                className={styles.selectList}
                value={this.state.selectedLanguage}
                onSelect={(selectedLanguage) => this.setState({selectedLanguage})}
                items={Copy.values.languages}
                renderItem={(item)=>{return <div key={item} className={styles.optionItem}>{item}</div>}}
              />
              <div className={styles.btnAdd} onClick={()=>{this.addLanguage()}}>
                <img src="/icons/default/add_button.svg" />
              </div>
            </div>
          </div>

          <div className={styles.terms_policy}>
            You agree to the Skiscool&nbsp;
            <Button className={styles.underline} type="label">Terms of Service</Button>
            &nbsp;and&nbsp;
            <Button className={styles.underline} type="label">Privacy Policy</Button>.
          </div>

          <Button className={styles.btnSignUp} onClick={()=>this.checkSignupParam()}>Sign up</Button>
          <FacebookButton
            className={styles.btnFacebook}
            appId="562112907171338"
            icon="fa-facebook-square"
            autoLoad={false}
            size="medium"
            textButton="Sign Up with Facebook"
            callback={signupWithFacebook} />
        </div>
      </div>
    );
  }
  render() {

    let styles = require('./styles.scss');
    if (this.props.pageType == "signupPage") {
      return this.renderSignupPage(styles)
    } else if (this.props.pageType == "loginPage") {
      return this.renderLoginPage(styles)
    }
  }

  static displayName = 'LoginForm';

  static propTypes = {
    // id: PropTypes.any.isRequired,
  };

}

export default container(LoginForm);
