/** @flow */

import React, { Component, PropTypes } from 'react';
import Button from 'components/common/button';
class Sidebar extends Component {

  static displayName = 'Sidebar';

  static propTypes = {};

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  state = {
    lockOpen: false,
    flagOpen: false,
    selectedItem: 0,
    selectedSubItem: -1
  };

  getWidth() {
    if (this.state.lockOpen || this.state.flagOpen) {
      return 200;
    }
    return 60;
  }
  show = () => {
    this.setState({ lockOpen: true });
  };

  hide = () => {
    this.setState({ lockOpen: false });
  };

  showHideMenuBar() {
    this.setState({ lockOpen: !this.state.lockOpen });
    this.props.gotoHomeView();
  };

  renderTopArea(styles, flagOpen) {
    return (
      <div className={styles.top_area}>
        <img
          src='/icons/logo.svg'
          className={styles.logo_icon}
          onClick={()=>this.showHideMenuBar()}
        />
      </div>
    );
  }

  renderButtonArea(styles) {
    if (this.props.flagLogin) {
      return (
        <div className={styles.buttonArea}>
          <Button type='label' className={styles.login} onClick={()=>this.props.logout()}>
            {'Logout - ' + this.props.profile.name}
          </Button>

          <Button type='label' className={styles.login} onClick={()=>this.props.gotoTestView()}>
            {'Emulate Device Location'}
          </Button>
        </div>
      )
    } else {
      return (
        <div className={styles.buttonArea}>
          <Button type='label' className={styles.login} onClick={()=>this.props.gotoSignUp()}>
            {'Signup'}
          </Button>

          <Button type='label' className={styles.login} onClick={()=>this.props.gotoLogin()}>
            {'Login'}
          </Button>
        </div>
      )
    }

  }
  render() {
    const styles = require('./styles.scss');
    let openVisible = (this.state.lockOpen || this.state.flagOpen) ? 'visible' : 'invisible';
    let closeVisible = (this.state.lockOpen || this.state.flagOpen) ? 'invisible' : 'visible';
    let containerClassName = 'not_opened';
    if (this.state.lockOpen || this.state.flagOpen) {
      containerClassName = 'opened'
    }
    return (
      <div
        className={styles.sidebar + ' ' + styles[containerClassName]}
      >
        <div className={styles['opened'] + ' ' + styles[openVisible]}>
          {this.renderTopArea(styles, true)}
          {this.renderButtonArea(styles)}
        </div>
        <div className={styles['closed'] + ' ' + styles[closeVisible]}>
          {this.renderTopArea(styles, false)}
        </div>
      </div>
    );
  }

}

export default Sidebar;
