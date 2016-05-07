import React, { Component, PropTypes} from 'react';
import Map from 'components/Map';
import container from './container';
import {isEqual} from 'lodash';

class Home extends Component {
  static propTypes = {
    socketClient: PropTypes.object.isRequired,
    user: PropTypes.object,
    signIn: PropTypes.func
  };

  state = {
    keyword: '',
    flagShowResult: false
  };

  componentDidMount() {
    // this.props.login('test');
    this.props.login({
      username: 'test',
      email: 'test@gmail.com',
      password: 'test',
      fromSocial: 'default'
    });
  }
  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.user, nextProps.user)) {
      if (nextProps.user.auth === true && nextProps.user.token && nextProps.user.token.length > 0) {
        this.props.socketClient.connect(this.props, {
          deviceID: 'admin_root_123',
          userName: 'admin_root_123',
          lat: '',
          lon: '',
          token: nextProps.user.token
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
