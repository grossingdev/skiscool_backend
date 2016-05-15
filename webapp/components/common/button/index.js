/**
 * Created by BaeBae on 5/10/16.
 */
import React, { Component, PropTypes } from 'react';

class Button extends Component {

  _onPress = (event) => {
    if (this.props.onClick && !this.props.disabled) {
      this.props.onClick(event);
    }
  }

  render() {
    const styles = require('./styles.scss');
    let {type, className, children, ...props} = this.props;
    return (
      <button {...props}
        className={styles.Button + ' ' + className + ' ' + styles['is' + type]}
        activeClassName="active"
        onClick={this._onPress}
      >
        {children}
      </button>
    );
  }

  static displayName = 'Button';

  static propTypes = {
    type: PropTypes.oneOf(['default', 'label', 'label underline']).isRequired,
    onClick: PropTypes.func,
    disabled: PropTypes.bool.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    type: 'default',
    disabled: false,
    className: '',
  };

}

export default Button;
