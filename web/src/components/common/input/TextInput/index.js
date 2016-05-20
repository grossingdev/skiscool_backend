/** @flow */


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
    if (this.props.type === 'num') {
      let numValue = parseInt(textValue, 10);
      if (isNaN(numValue)) {
        textValue = "";
      } else {
        textValue = numValue.toString();
      }
    }

    this.setState({textValue});
    this.props.onChange && this.props.onChange(textValue);
  }

  render() {
    let styles = require('./styles.scss');
    let {errorText, className, ...props} = this.props;
    let inputClassName = "";
    let flagAutoFocus = false;
    if (errorText && errorText.length > 0) {
      inputClassName = "input-error";
    }

    if (this.props.noUnderline) {
      inputClassName = inputClassName + ' ' + styles.no_border;
    }

    let value = this.state.textValue;
    if (this.props.value) {
      value = this.props.value;
    }
    return (
      <div className={styles.TextInput + ' ' + className}>
        <input
          ref="inputText"
          {...props}
          className={inputClassName}
          onChange={(event) => {this.onChange(event.target.value)}}
          value={value}
        ></input>
        {errorText && errorText.length > 0 && <div className={styles.label_error}>{errorText}</div>}
      </div>
    );
  }

  static displayName = 'TextInput';

  static propTypes = {
    // id: PropTypes.any.isRequired,
  };

}

export default TextInput;
