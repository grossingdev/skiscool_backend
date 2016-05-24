/**
 * Created by baebae on 4/19/16.
 */
import React, {Component, Image, Modal, ActivityIndicatorIOS, View, ScrollView, StyleSheet, Text} from 'react-native';

export default class WaitingProgress extends Component {
  render() {
    return (
      <Modal transparent={true}>
        <View style={[styles.wrapper]}>
          <ActivityIndicatorIOS color="#FFFFFF"/>
          <Text style={styles.label}>{this.props.label}</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    marginTop: 10,
    fontSize: 15,
    color: 'white',
    textAlign: 'center'
  }
});