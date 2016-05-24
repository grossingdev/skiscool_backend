import React, {
  StyleSheet,
  ScrollView, 
  View,
  Image,  
  Component,
  Dimensions,PropTypes,
  TouchableOpacity
} from 'react-native';
 
import constant from '../styles/constant';
import SimpleMarker from './MapPage/markers/SimpleMarker';
 
var DEVICE_HEIGHT = Dimensions.get('window').height;
var DEVICE_WIDTH = Dimensions.get('window').width;

var MapPicture = React.createClass({
  propTypes: {
    imageComponent:     PropTypes.func,
    maximumZoomScale:   PropTypes.number,
    minimumZoomScale:   PropTypes.number,
  },
 
  getDefaultProps: function() {
    return {
    Layer_markers:[{x:0,y:0},{x:0,y:200},{x:175,y:0},{x:175,y:200}],
      maximumZoomScale: 1,
      minimumZoomScale: 1,
      imageComponent: Image
    };
  },

  getInitialState: function() {
    return {
      width: DEVICE_WIDTH,
      height: DEVICE_HEIGHT,
    };
  }, 
 /*
 onImageLayout: function (e) {
    var layout = e.nativeEvent.layout;
   
    var aspectRatio = this.props.originalWidth / this.props.originalHeight;
    var measuredHeight = layout.width / aspectRatio;
    var currentHeight = layout.height;
    if (measuredHeight != currentHeight) {
      this.setState({
        style: {
          height: measuredHeight
        }
      });
    }
  },
  */
  componentDidMount: function() { 
   if(Image.getSize && this.props.source) {
    if(typeof (this.props.source.uri) !=='undefined'){
      Image.getSize(this.props.source.uri,
        (width, height) => {
          this.setState({width, height});
        });
      }
    }
  }, 
  render: function() {
    var { width, height } = this.state;
    var {
      style,
      minimumZoomScale,
      maximumZoomScale,
      imageComponent,
      Layer_markers,
      ...props
    } = this.props;

    var ImageComponent = imageComponent;
    var scale = Math.max(width/DEVICE_WIDTH, height/DEVICE_HEIGHT);
 
    return (
      <ScrollView
        style={{ flex: 1 }}
        automaticallyAdjustContentInsets={false}
        bounces={false}
        centerContent={true}
        decelerationRate={0.95}
        minimumZoomScale={minimumZoomScale}
        maximumZoomScale={maximumZoomScale}
      >  
        <ImageComponent {...props} style={[{ width: width/scale, height: height/scale }, style]} />
        <View style={{position:'absolute',left:0,top:0}}>
          { 
          Layer_markers.map(function(marker, index) {
          console.log({left:marker.x,top:marker.y});
          return <SimpleMarker 
              		key={index} 
              		style={{position:'absolute',left:marker.x,top:marker.y}} />
        })}
          </View>
      </ScrollView>
      )}
/*
var MapPicture = React.createClass({

  render() {
  console.log('Picture_render'); 
    return (
      <ScrollView style={styles.container} directionalLockEnabled={false}
            horizontal={true}>
        <Image source={require('./images/Val_Thorens.jpg')} style={styles.imageresort}/>
      </ScrollView>  
    )}  */
        
        });
        
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: constant.colors.navBackColor,
    paddingTop:20
  }
});


export default MapPicture; 