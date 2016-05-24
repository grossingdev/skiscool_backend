import React, {Component, Image, Modal, Text, TouchableOpacity, View, StyleSheet} from 'react-native';

import KeyboardSpacer from './KeyboardSpacer';
export default class CustomModal extends Component {

  static propTypes = {
    closeButton: React.PropTypes.bool
  };

  static defaultProps = {};

  renderCloseButton() {
    if (this.props.closeButton) {
        return (
          <TouchableOpacity style={styles.closeButton} onPress={this.props.onClose}>
            <Text>Close</Text>
          </TouchableOpacity>
        )
      }
  }

  render() {
    return (
      <Modal
        transparent={true}>
        <View style={[styles.wrapper, this.props.containerStyle]}>
          {this.props.children}
          {this.renderCloseButton()}
          <KeyboardSpacer/>
        </View>
      </Modal>
    );
  }
}

let styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(60,60,60,0.74)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  closeButton: {
    height: 80,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center'
  }
});