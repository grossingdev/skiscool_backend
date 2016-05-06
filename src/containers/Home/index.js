import React, { Component, PropTypes} from 'react';
import Map from 'components/Map';
import container from './container';
import {isEqual} from 'lodash';

class Home extends Component {
  static propTypes = {
    socketClient: PropTypes.object.isRequired,
    user: PropTypes.object
  };
  state = {
    keyword: '',
    flagShowResult: false
  };
  componentDidMount() {
    //this.props.login('test');
    this.props.signIn({
      username: 'test',
      email: 'test@gmail.com',
      password: 'test'
    });
  }
  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.user, nextProps.user)) {
      if (nextProps.user.auth === true) {
        this.props.socketClient.connect(this.props, {
          deviceID: 'admin_root_123',
          userName: 'admin_root_123',
          lat: '',
          lon: ''
        });
      }
    }
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
