/**
 * Created by baebae on 4/20/16.
 */
import React,{
  Component,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  Animated
} from 'react-native';

export default class Panel extends Component{
  icons = {
    'up': require('./images/Arrow-up.png'),
    'down': require('./images/Arrow-down.png')
  };

  state = {
    title: this.props.title,
    expanded: false,
    animation: new Animated.Value()
  };

  _setMaxHeight(event) {
    let maxHeight = event.nativeEvent.layout.height;
    this.setState({maxHeight});
  }

  _setMinHeight(event) {
    let minHeight = event.nativeEvent.layout.height;
    this.setState({minHeight});
  }

  toggle() {
    let initialValue = this.state.expanded ? this.state.maxHeight + this.state.minHeight : this.state.minHeight;
    let toValue = this.state.expanded? this.state.minHeight : this.state.maxHeight + this.state.minHeight;

    this.setState({
      expanded: !this.state.expanded,
      animation: new Animated.Value()
    });

    this.state.animation.setValue(initialValue);
    Animated.spring(this.state.animation, {toValue}).start();
  }

    _setMaxHeight(event) {
      let maxHeight = event.nativeEvent.layout.height;
      this.setState({maxHeight});
      this.toggle();
    }

    _setMinHeight(event) {
      let minHeight = event.nativeEvent.layout.height;
      this.setState({minHeight});
    }

    render() {
      let icon = this.icons['down'];
      if (this.state.expanded) {
        icon = this.icons['up'];
      }

      // console.log('etat:');
      // console.log(this.state.expanded);

      return (
        <Animated.View
          style={[styles.container,{height: this.state.animation}]}>

          <View style={styles.titleContainer} onLayout={(event)=> this._setMinHeight(event)}>
            <Text style={styles.title}>{this.state.title}</Text>
            <TouchableHighlight
              style={styles.button}
              onPress={()=>this.toggle()}
              underlayColor="#f1f1f1">
              <Image
                style={styles.buttonImage}
                source={icon}
              />
            </TouchableHighlight>
          </View>
                
          <View style={styles.body} onLayout={(event) => this._setMaxHeight(event)}>
            {this.props.children}
          </View>
        </Animated.View>
      );
    }
}

let styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: 10,
    overflow: 'hidden'
  },
  titleContainer: {
    flexDirection: 'row'
  },
  title: {
    flex: 1,
    padding: 10,
    color: '#2a2f43',
    fontWeight: 'bold'
  },
  buttonImage: {
    width: 30,
    height: 25
  },
  body: {
    padding: 10,
    paddingTop: 0
  }
});
