require('./styles.css');

import React, { Component,PropTypes, cloneElement,  Children} from 'react';
import container from './container';
import {SocketClient} from 'utils/socket';

let socketClient = null;
class Base extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  _childrenWithProps() {
    return cloneElement(Children.only(this.props.children), Object.assign({}, {
      socketClient: socketClient,
    }, this.props));
  }

  render() {
    return (
      <div className='Base'>
        <div className="Base_Content" >
          {this._childrenWithProps()}
        </div>
      </div>
    );
  }

  componentWillMount() {
    if (socketClient == null) {
      socketClient = new SocketClient();
    }
  }
}

export default container(Base);
