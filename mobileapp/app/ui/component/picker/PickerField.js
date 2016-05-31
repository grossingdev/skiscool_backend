/**
 * Created by BaeBae on 5/26/16.
 */
import React, {Component, Image, Text, TouchableWithoutFeedback, View, StyleSheet} from 'react-native';

import Picker from 'react-native-fm-picker';
import constant from '../../styles/constant';

export default class PickerField extends Component {

  static propTypes = {
    value: React.PropTypes.any.isRequired,
    icon: React.PropTypes.object,  // packager asset object
    placeholder: React.PropTypes.string,
    errorText: React.PropTypes.string
  };

  state = {
    focus: false
  };

  static defaultProps = {};

  handlePress() {
    this.refs.picker.show();
  }

  renderValue() {
    let labelIcon;
    if (this.props.icon) {
      labelIcon = <Image resizeMode="contain" source={this.props.icon} style={styles.icon} />
    }

    // Render the placeholder, or the value
    let value = this.props.value ?  <Text style={[styles.valueText, this.props.lightTheme && styles.valueTextLight]}>{this.props.value}</Text> : <Text style={[styles.valueText, styles.placeholderText, this.props.lightTheme && styles.placeholderTextLight, this.props.lightTheme && styles.valueTextLight]}>{this.props.placeholder}</Text>;
    return (
      <View style={styles.value}>
        {labelIcon}
        {value}
      </View>
    )
  }

  renderErrorText() {
    if (this.props.errorText) {
      return (
        <View style={styles.error}>
          <Text style={styles.errorText}>{this.props.errorText}</Text>
        </View>
      )
    }
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.handlePress.bind(this)}>
        <View style={[styles.wrapper, this.props.containerStyle]}>
          <View style={styles.row}>
            {this.renderValue()}
            <Image style={styles.dropdownIcon} source={require('image!drop_down_arrow')} />
          </View>
          <View style={[styles.underline, this.props.lightTheme && styles.underlineLight]}/>
          <Picker ref="picker"
            {...this.props}
                  onSubmit={this.props.onValueChange}
                  selectedOption={this.props.value}
                  onBlur={(ev)=> {
              this.setState({focus: false});
              if (this.props.onBlur) this.props.onBlur(ev);
            }}
                  onFocus={()=> this.setState({focus: true})}
          />
          <View
            style={[
              this.props.lightTheme ? styles.underlineLight : styles.underline,
              this.state.focus ? this.props.lightTheme ? styles.underlineFocusLight : styles.underlineFocus : null,
              this.props.errorText && styles.underlineError
            ]}
          />
          {this.renderErrorText()}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

let styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  row: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  value: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    paddingRight: 20
  },
  valueText: {
    fontSize: 15,
    color: constant.colors.darkGrey,
    paddingBottom: 3
  },
  valueTextLight: {
    color: constant.colors.darkGrey
  },
  placeholderText: {
    opacity: 0.7
  },
  placeholderTextLight:{
    opacity: 1
  },
  icon: {
    marginRight: 10,
    width: 17,
    height: 17,
    marginBottom: 6
  },
  underline: {
    alignSelf: 'stretch',
    height: 0.75,
  },
  underlineError: {
    marginTop: -2,
    height: 2,
    backgroundColor: 'red'
  },
  underlineFocus: {
    backgroundColor: constant.colors.grey
  },
  underlineFocusLight: {
  },
  error: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
  underlineLight:{
    backgroundColor: constant.colors.grey
  },
  dropdownIcon: {
    width: 14,
    height: 14,
    marginBottom: 4
  }
});
