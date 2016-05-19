/** @flow */

import React, { Component, PropTypes } from 'react';
import Button from 'components/common/button';
import Copy from 'utils/copy';
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

    if (this.state.lockOpen || this.state.flagOpen) {
      this.props.updateShowSidebar(0)
    } else {
      this.props.updateShowSidebar(1);
    }

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

  updateMarkerStyle(markerStyle) {
    if (markerStyle == this.props.markerStyle) {
      markerStyle = 0;
    }
    this.props.updateMarkerStyle(markerStyle);
  }

  renderButton(styles, flagShowLabel) {

    let buttons = Copy.markerMenuItems.map((itemInfo, index) => {
      let icon = itemInfo.icon + '.svg';
      let active_style = '';
      if (index + 1 == this.props.markerStyle) {
        icon = itemInfo.icon + '_active.svg';
        active_style = styles.active;
      }
      return (
        <Button key={index} type="label" className={styles.markerButton} onClick={()=>{this.updateMarkerStyle(index + 1);}}>
          <img src={icon}/>
          {flagShowLabel && <div className={styles.item_label + ' ' + active_style}>{itemInfo.label}</div>}
        </Button>
      )
    });

    return (
      <div className={styles.markerStyleContainer}>
        {buttons}
      </div>
    )
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

          {this.renderButton(styles, true)}
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
          {this.renderButton(styles, false)}
        </div>
      </div>
    );
  }

}

import container from './container';

export default container(Sidebar);
