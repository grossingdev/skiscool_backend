/** @flow */

require('./styles.scss');

import React, { Component, PropTypes } from 'react';

class TextArea extends Component {

  state = {
    textValue: ""
  };

  getText() {
    return this.state.textValue;
  }

  clearText() {
    this.setState({textValue: ""})
  }

  componentWillReceiveProps(nextProps) {
    this.setState({textValue: nextProps.textValue});
  }

  onChange(textValue) {
    this.setState({textValue});
    this.props.onChange && this.props.onChange(textValue);
  }
  render() {
    let {errorText, className, ...props} = this.props;
    let inputClassName = "";
    if (errorText && errorText.length > 0) {
      inputClassName = "input-error";
    }
    let value = this.state.textValue;
    if (this.props.value) {
      value = this.props.value;
    }
    return (
      <div className={"TextArea " + className}>
        <textarea
          {...props}
          className={inputClassName}
          onChange={(event) => {this.onChange(event.target.value)}}
          value={value}
        ></textarea>
      </div>
    );
  }

  static displayName = 'TextArea';

  static propTypes = {
    // id: PropTypes.any.isRequired,
  };

}

export default TextArea;
