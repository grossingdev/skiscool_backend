import React,{
  Component,
  StyleSheet,
  Text,
  View,
} from 'react-native';

exports.framework = 'React';
exports.title = 'GPSLocation';
exports.description = 'Examples of using the GPSLocation API.';


export default class GPSLocation extends Component{
  render() {
    return (
      <View>
        <Text>
          <Text style={styles.title}>Initial position: </Text>
          {JSON.stringify(this.props.deviceInfo.initLoc)}
        </Text>
        <Text>
          <Text style={styles.title}>Current position: </Text>
          {JSON.stringify(this.props.deviceInfo.lastLoc)}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontWeight: '500',
  },
});

