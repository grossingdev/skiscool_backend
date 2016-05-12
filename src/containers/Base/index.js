
import React, { Component, PropTypes, cloneElement, Children} from 'react';
import container from './container';
import {SocketClient} from 'utils/socket';
import MainSideBar from 'components/Sidebar';

let socketClient = null;
class Base extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  componentWillMount() {
    if (socketClient === null) {
      socketClient = new SocketClient();
    }
  }

  _childrenWithProps() {
    return cloneElement(Children.only(this.props.children), Object.assign({}, {
      socketClient: socketClient,
    }, this.props));
  }

  render() {
    const styles = require('./styles.scss');
    return (
      <div className={styles.Base}>
        {this.renderMainSideBar()}
        <div className={styles.Base_Content}>
          {this._childrenWithProps()}
        </div>
      </div>
    );
  }
  gotoSignUp() {
    this.context.router.push('/signup');
    this.refs.MainSidebar.hide();
  }

  gotoLogin() {
    this.context.router.push('/login');
    this.refs.MainSidebar.hide();
  }

  gotoTestView() {
    this.context.router.push('/test');
  }

  gotoHomeView() {
    this.context.router.push('/');
  }
  renderMainSideBar () {
    return (
      <MainSideBar
        ref='MainSidebar'
        alignment='left'
        gotoSignUp={()=>{this.gotoSignUp()}}
        gotoLogin={()=>{this.gotoLogin()}}
        gotoTestView={()=>{this.gotoTestView()}}
        gotoHomeView={()=>{this.gotoHomeView()}}
      >
      </MainSideBar>
    );
  }
}

export default container(Base);
