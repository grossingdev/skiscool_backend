import React, { Component, PropTypes} from 'react';
import Map from 'components/Map';
import container from './container';

class Home extends Component {
  static propTypes = {
    socketClient: PropTypes.object.isRequired,
  };
  state = {
    keyword: '',
    flagShowResult: false
  };

  componentDidMount() {
    this.props.socketClient.connect(this.props, {
      deviceID: 'admin_root_123',
      userName: 'admin_root_123',
      lat: '',
      lon: ''
    });
  }

  render() {
    const styles = require('./styles.scss');
    return (
      <div>
        <Map
          {...this.props}
        />
        <div className={styles.HomeArea}>
        </div>
      </div>
    );
  }
}

export default container(Home);
