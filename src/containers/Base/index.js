
import React, { Component, PropTypes, cloneElement, Children} from 'react';
import container from './container';
import {SocketClient} from 'utils/socket';

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
        <div className={styles.Base_Content}>
          {this._childrenWithProps()}
        </div>
      </div>
    );
  }
}

export default container(Base);
