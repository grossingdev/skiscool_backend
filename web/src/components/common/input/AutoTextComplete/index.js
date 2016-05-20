/** @flow */


import React, { Component, PropTypes } from 'react';
import AutoComplete from './Autocomplete';

class AutoTextComplete extends Component {
  matchStateToTerm(itemValue, value) {
    return true;
    return (itemValue.toLowerCase().indexOf(value.toLowerCase()) !== -1)
  }

  sortStates(itemValue1, itemValue2, value) {
    return 1;
    return (
      itemValue1.toLowerCase().indexOf(value.toLowerCase()) >
      itemValue2.toLowerCase().indexOf(value.toLowerCase()) ? 1 : -1
    )
  }

  render() {
    let styles = require('./styles.scss');
    let {errorText, className, ...props} = this.props;
    if (errorText && errorText.length > 0) {
      className = className + " input-error";
    }
    return (
      <div className={styles.AutoComplete + ' ' + className}>
        <AutoComplete
          value={this.props.value}
          labelText=""
          inputProps={this.props.inputProps}
          items={this.props.items}
          getItemValue={(item) => item}
          onClick={this.props.onClick}
          shouldItemRender={this.matchStateToTerm}
          onChange={(event, value) => this.setState({ value })}
          onSelect={(value) => this.props.onSelect(value)}
          renderItem={(item, isHighlighted) => {return this.props.renderItem(item, isHighlighted)}}
        />
        {errorText && errorText.length > 0 && <div className={styles.label_error}>{errorText}</div>}
      </div>

    )
  }

  static displayName = 'AutoTextComplete';

  static propTypes = {
    // id: PropTypes.any.isRequired,
  };

}

export default AutoTextComplete;
