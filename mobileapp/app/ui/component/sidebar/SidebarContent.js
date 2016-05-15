/**
 * Created by baebae on 4/5/16.
 */
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

const window = Dimensions.get('window');
import constant from '../../styles/constant';
import AccountPageContainer from './Login/PageContainer';
class SidebarContent extends Component {
  state = {
  };
  renderAvatarContainer() {
    return (
      <ScrollView style={styles.container}>
        <AccountPageContainer
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
    width: window.width * 0.6,
    height: window.height,
    paddingLeft: 10,
    paddingTop: 20,
    backgroundColor: '#2C3E50',
  },
  container: {
    flex: 1
  },

});

export default SidebarContent;