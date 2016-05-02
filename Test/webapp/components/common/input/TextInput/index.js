/** @flow */

require('./styles.css');

import React, { Component, PropTypes } from 'react';

class TextInput extends Component {

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

  componentWillReceiveProps(nextProps) {
    let {errorText} = nextProps;
    if (errorText && errorText.length > 0) {
      this.refs.inputText.focus();
    }
  }

  onChange(textValue) {
    this.setState({textValue});
    this.props.onChange && this.props.onChange(textValue);
  }

  render() {
    let {errorText, className, ...props} = this.props;
    let inputClassName = "";
    let flagAutoFocus = false;
    if (errorText && errorText.length > 0) {
      inputClassName = "input-error";
    }

    if (this.props.noUnderline) {
      inputClassName = inputClassName + " no_border";
    }

    let value = this.state.textValue;
    if (this.props.value) {
      value = this.props.value;
    }
    return (
      <div className={"TextInput " + className}>
        <input
          ref="inputText"
          {...props}
          className={inputClassName}
          onChange={(event) => {this.onChange(event.target.value)}}
          value={value}
        ></input>
        {errorText && errorText.length > 0 && <div className="label_error">{errorText}</div>}
      </div>
    );
  }

  static displayName = 'TextInput';

  static propTypes = {
    // id: PropTypes.any.isRequired,
  };

}

export default TextInput;
