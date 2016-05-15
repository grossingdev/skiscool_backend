import React, {Component, Image, Text, TouchableOpacity, View, StyleSheet, TextInput} from 'react-native';
import Modal from '../../../component/modal/Modal';

export default class CreatePackageConfirm extends Component {
  state = {
    value: ""
  };

  _onChangeText(value) {
    this.setState({value});
  }

  getTextValue() {
    return this.state.value;
  }

  renderButtons() {
    let component = this;
    let buttons = [
      {label: 'Cancel', onPress: () => {component.props.onCancel()}},
      {label: 'Save', theme: 'info', onPress: () => {component.props.onConfirm(this.state.value)}}
    ];

    return buttons.map((button) => {
      let theme = {
        button: null,
        text: null
      };
      if (button.theme === 'danger') {
        theme.button = {backgroundColor: 'rgb(252,110,110)'};
      } else if (button.theme === 'info') {
        theme.button = {backgroundColor: 'rgb(23, 153, 204)'};
      }
      return (
        <TouchableOpacity key={button.label} style={[styles.button, theme.button]}>
          <TouchableOpacity onPress={button.onPress} style={styles.touchable}>
            <Text style={[styles.buttonText, theme.text]}>{button.label}</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      )
    })
  }

  render() {
    return (
      <Modal>
        <View style={styles.confirmDialogContainer}>
          <Text style={styles.confirmTitle}>{this.props.title}</Text>
          <Text style={styles.confirmMessage}>{this.props.message}</Text>
          <Text style={styles.confirmMessage1}>{this.props.message1}</Text>
          <TextInput
            value={this.state.value}
            onChangeText={(text)=>this._onChangeText(text)}
            placeholder={this.props.placeholder}
            style={styles.input}
          ></TextInput>

          <View style={styles.buttonArea}>
            {this.renderButtons()}
          </View>
        </View>
      </Modal>
    )
  }
}

let styles = StyleSheet.create({
  confirmDialogContainer: {
    backgroundColor: 'white',
    alignSelf: 'stretch',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  confirmTitle: {
    marginVertical: 10,
    fontSize: 19
  },
  confirmMessage: {
    marginTop: 5,
    fontSize: 15,
    textAlign: 'center'
  },
  confirmMessage1: {
    fontSize: 12,
    color: '#AAAAAA',
    textAlign: 'center'
  },
  input: {
    height: 30,
    fontSize: 14,
    padding: 3,
    marginHorizontal: 20,
    paddingHorizontal: 10,
  },
  buttonArea: {
    marginTop: 10,
    marginBottom: 10,
    height: 30,
    alignSelf: 'stretch',
    flexDirection: 'row',
    overflow: 'hidden',
    borderRadius: 10,
    marginHorizontal: 30,
    flex: 1,
  },
  button: {
    flex: 1,
    backgroundColor: '#C5C4C4', // not in stylesheet
    marginRight: 1
  },
  touchable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    lineHeight: 21
  }
});