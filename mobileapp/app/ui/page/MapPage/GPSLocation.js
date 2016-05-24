import React,{
  Component,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Panel from './Panel';
exports.framework = 'React';
exports.title = 'GPSLocation';
exports.description = 'Examples of using the GPSLocation API.';


export default class GPSLocation extends Component{
  render() {
    return (
 	<Panel style={styles.title} title="DeviceInfo:" expanded="false">
        <Text>
          <Text style={styles.title}>Initial position: </Text>
          {JSON.stringify(this.props.deviceInfo.initLoc)}
        </Text>
        <Text>
          <Text style={styles.title}>Current position: </Text>
          {JSON.stringify(this.props.deviceInfo.lastLoc)}
        </Text>
    </Panel>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontWeight: '500',
  },
});

