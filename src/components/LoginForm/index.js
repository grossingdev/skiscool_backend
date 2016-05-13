/** @flow */


import React, { Component, PropTypes } from 'react';

import container from './container';
import Button from 'components/common/button';
import TextInput from 'components/common/input/TextInput';
import AutoTextComplete from 'components/common/input/AutoTextComplete';
import FacebookButton from 'components/common/button/Facebook';
import Copy from 'utils/copy';
import {has, isEqual} from 'lodash';
import Api from 'utils/api';
class LoginForm extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  state = {
    username_error_text: '',
    password_error_text: '',
    email_error_text: '',
    age_error_text: '',
    language_error_text: '',
    languages: [],
    gender: Copy.values.genders[0],
    userType: Copy.values.userTypes[0],
    selectedLanguage: ''
  };

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
        this.setState(state);
      }
      if (apiResult.error_code == 0) {
        alert(apiResult.msg);
        this.props.resetAPIResult();
        this.clearFormViews();
      }
    }

    if (nextProps.user.profile.name && nextProps.user.token.length > 0) {
      this.context.router.replace('/');
    }
  }

  checkSignupParam() {
    let name = this.refs.username.getText();
    let email = this.refs.email.getText();
    let password = this.refs.password.getText();
    let age = this.refs.age.getText();

    this.setState({
      username_error_text: name ? '' : Copy.common.required,
      email_error_text: email ? '' : Copy.common.required,
      password_error_text: password ? '' : Copy.common.required,
      age_error_text: age ? '' : Copy.common.required,
      language_error_text: this.getLanguages() ? '': Copy.common.required
    });

    if (name && email && password && age ) {
      this.props.signIn({
        name,
        email,
        password,
        age,
        gender: this.state.gender,
        userType: this.state.userType.toLowerCase(),
        languages: this.getLanguages(),
        fromSocial: 'default'
      });
    }
  }

  checkLoginParam() {
    let email = this.refs.email.getText();
    let password = this.refs.password.getText();

    this.setState({
      email_error_text: email ? '' : Copy.common.required,
      password_error_text: password ? '' : Copy.common.required
    });

    if (email && password) {
      this.props.login({
        email,
        password,
        userType: this.state.userType.toLowerCase(),
        fromSocial: 'default'
      });
    }
  }

  clearFormViews() {
    this.setState({
      username_error_text: '',
      password_error_text: '',
      email_error_text: '',
      age_error_text: '',
      language_error_text: ''
    });

    if (this.props.pageType == "signupPage") {
      this.refs.username.clearText();
      this.refs.age.clearText();
      this.setState({languages: []});
    }

    this.refs.email.clearText();
    this.refs.password.clearText();
  }

  switchView() {
    this.clearFormViews();
    if (this.props.pageType == "loginPage") {
      this.context.router.replace('/signup');
    } else if (this.props.pageType == "signupPage"){
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
          {this.renderUserTypeArea(styles)}
          <TextInput ref= "email" placeholder="Email" errorText={this.state.email_error_text}/>
          <TextInput ref= "password" placeholder="Password" type="password" errorText={this.state.password_error_text}/>

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

  addLanguage() {
    let {languages} = this.state;
    if (!_.includes(languages, this.state.selectedLanguage)) {
      languages.push(this.state.selectedLanguage);
      this.setState({languages});
    }
  }

  getLanguages() {
    let ret = '';
    _.forEach(this.state.languages, (item) => {
      if (ret.length > 0) {
        ret = ret + ', ' + item;
      } else {
        ret = item;
      }
    });
    return ret;
  }

  renderUserTypeArea(styles) {
    return (
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
          {this.renderUserTypeArea(styles)}

          <TextInput ref= "username" placeholder="Username" errorText={this.state.username_error_text}></TextInput>
          <TextInput ref= "email" placeholder="Email" errorText={this.state.email_error_text}></TextInput>
          <TextInput ref= "password" placeholder="Password" type="password" errorText={this.state.password_error_text}></TextInput>

          <div className={styles.rowContainer}>
            <TextInput ref= "age" placeholder="Age" type="num" errorText={this.state.age_error_text} />
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
            <TextInput ref= "language" placeholder="Languages" readOnly={true} value={this.getLanguages()} errorText={this.state.language_error_text}></TextInput>
            <div className={styles.btnDelete} onClick={()=>{this.setState({languages: []})}}>
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
