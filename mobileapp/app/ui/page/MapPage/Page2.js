/**
 * Created by baebae on 4/20/16.
 */
import React, {Component, Image, View, StyleSheet, Text, TouchableOpacity} from 'react-native';
export default class Page2 extends Component {
  render() {
    return (
      <View style={styles.pageContainer}>
        <Text style={styles.text}>Beautiful</Text>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  }
});