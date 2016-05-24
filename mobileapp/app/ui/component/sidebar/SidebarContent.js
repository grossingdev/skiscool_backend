/**
 * Created by baebae on 4/5/16.
 */
 //parent sidebar
import React, {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Image,
  TouchableHighlight,
  ListView,
  Component,
  Dimensions,
  TouchableOpacity
} from 'react-native';
 
import constant from '../../styles/constant';
import Account from '../Login/Account';
class SidebarContent extends Component {
  state = {
  };
  renderAvatarContainer() {
    return (
      <ScrollView style={styles.container}>
        <Account
          {...this.props}
        />
      </ScrollView>
    )
  }

  render() {
    return (
      <ScrollView scrollsToTop={false} style={styles.menu}>
        {this.renderAvatarContainer()}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    paddingLeft: 10,
    paddingTop: 20,
    backgroundColor: '#2C3E50',
  },
  container: {
    flex: 1
  },

});

export default SidebarContent;