/**
 * Created by BaeBae on 5/12/16.
 */

import React, { Component, PropTypes } from 'react';
import LoginForm from 'components/LoginForm';
import AppPage from 'components/LoginForm/AppPage';

class AccountView extends Component {
  state = {
    msg: 'Hello World',
  };
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.authenticated) {
      this.context.router.goBack();
    }
  }

  render() {
    let styles = require('./styles.scss');
    let pageType = "loginPage";
    if (this.props.routes[this.props.routes.length - 1].path === "/signup") {
      pageType = "signupPage";
    }
    return (
      <div className={styles['AccountView']}>
        <div className={styles['component_area']}>
          <LoginForm
            pageType={pageType}
          ></LoginForm>
        </div>
        <div className={styles['app_area']}>
          <AppPage></AppPage>
        </div>
      </div>
    );
  }
}

export default AccountView;