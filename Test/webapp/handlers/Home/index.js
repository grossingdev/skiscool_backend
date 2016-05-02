require('./styles.css');

import React, { Component } from 'react';
import Map from 'Map';
import container from './container';

class Home extends Component {

  state = {
    keyword: "",
    flagShowResult: false
  };

  componentDidMount() {
    this.props.socketClient.connect(this.props, {
      deviceID: 'admin_root_123',
      userName: 'admin_root_123',
      lat: "",
      lon: ""
    });
  }

  render() {
    return (
      <div>
        <Map
          {...this.props}
        />
        <div className="HomeArea">
        </div>
      </div>
    );
  }

  static displayName = 'Home';

  static propTypes = {
    // id: PropTypes.any.isRequired,
  };

}

export default container(Home);
