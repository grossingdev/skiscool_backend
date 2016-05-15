/**
 * Created by baebae on 3/24/16.
 */
import React, {Component, Image, Modal, Text, TouchableOpacity, View, ScrollView, StyleSheet} from 'react-native';

export default class SwitchButton extends Component {

  static defaultProps = {};

  getSelectedStyle() {
    let idx = this.props.options.indexOf(this.props.value);
    if (this.props.selectedStyle) {
      return this.props.selectedStyle;
    } else if (this.props.selectedStyles && this.props.selectedStyles[idx]) {
      return this.props.selectedStyles[idx];
    }

  }

  getSelectedTextStyle() {
    if (this.props.selectedTextStyle) {
      return this.props.selectedTextStyle;
    } else {
      return styles.selectedOptionText;
    }
  }

  renderOptions() {
    return this.props.options.map((option) => {
      let selectedStyle = option === this.props.value ? this.getSelectedStyle() : null;
      let selectedTextStyle = option === this.props.value ? this.getSelectedTextStyle() : null;

      return (
        <TouchableOpacity
          style={[styles.option, selectedStyle]}
          onPress={() => {this.props.onSelect(option)}}
          key={option}
          activeOpacity={1}>
          <Text style={[styles.optionText, this.props.textStyle, selectedTextStyle]}>{option}</Text>
        </TouchableOpacity>
      )
    });
  }

  render() {
    return (
      <View style={[styles.wrapper, this.props.style]}>
        <View style={[styles.track, this.props.trackStyle]}>
          {this.renderOptions()}
        </View>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  wrapper: {
  },
  track: {
    backgroundColor: 'grey',
    height: 50,
    borderRadius: 5,
    flexDirection: 'row'
  },
  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  optionText: {
    color: 'white',
    fontSize: 13,
    lineHeight: 13,
    marginBottom: -3
  },
  selectedOption: {
    backgroundColor: 'white'
  },
  selectedOptionText: {
    color: 'black'
  }
});