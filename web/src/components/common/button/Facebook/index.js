/**
 * Created by BaeBae on 5/12/16.
 */
import React, { PropTypes } from 'react';
import Button from 'components/common/button';

class FacebookButton extends React.Component {

  static propTypes = {
    callback: PropTypes.func.isRequired,
    appId: PropTypes.string.isRequired,
    xfbml: PropTypes.bool,
    cookie: PropTypes.bool,
    scope: PropTypes.string,
    textButton: PropTypes.string,
    autoLoad: PropTypes.bool,
    size: PropTypes.string,
    fields: PropTypes.string,
    version: PropTypes.string,
    icon: PropTypes.string,
    language: PropTypes.string,
  };

  static defaultProps = {
    textButton: 'Login with Facebook',
    scope: 'public_profile, email',
    xfbml: false,
    cookie: false,
    size: 'metro',
    fields: 'email, first_name, last_name, bio',
    version: '2.3',
    language: 'en_US',
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let fbRoot = document.createElement('div');
    fbRoot.id = 'fb-root';

    document.body.appendChild(fbRoot);

    window.fbAsyncInit = () => {
      FB.init({
        appId: this.props.appId,
        xfbml: this.props.xfbml,
        cookie: this.props.cookie,
        version: 'v' + this.props.version,
      });

      if (this.props.autoLoad) {
        FB.getLoginStatus(this.checkLoginState);
      }
    };

    // Load the SDK asynchronously
    let loadFacebook = ((d, s, id) => {
      const element = d.getElementsByTagName(s)[0];
      const fjs = element;
      let js = element;
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = '//connect.facebook.net/' + this.props.language + '/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    });
    loadFacebook(document, 'script', 'facebook-jssdk');
  }

  responseApi = (authResponse) => {
    FB.api('/me', { fields: this.props.fields }, (me) => {
      me.accessToken = authResponse.accessToken;
      this.props.callback(me);
    });
  };

  checkLoginState = (response) => {
    if (response.authResponse) {
      this.responseApi(response.authResponse);
    } else {
      if (this.props.callback) {
        this.props.callback({ status: response.status });
      }
    }
  };

  click = () => {
    FB.login(this.checkLoginState, { scope: this.props.scope });
  };

  renderWithFontAwesome(styles) {
    let {...props} = this.props;
    return (
      <div>
        <Button
          {...props}
          onClick={this.click}>
          <i className={styles['fa'] + ' fa ' + this.props.icon}></i>
          {this.props.textButton}
        </Button>

        <style dangerouslySetInnerHTML={{ __html: styles }}></style>
      </div>
    )
  }

  render() {
    let styles = require('./styles.scss');
    if (this.props.icon) {
      return this.renderWithFontAwesome(styles);
    }
    let {...props} = this.props;
    return (
      <div>
        <Button
          {...props}
          onClick={this.click}>
          {this.props.textButton}
        </Button>

        <style dangerouslySetInnerHTML={{ __html: styles }}></style>
      </div>
    );
  }
}

export default FacebookButton;