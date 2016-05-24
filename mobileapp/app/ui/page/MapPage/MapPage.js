/**
 * Created by baebae on 4/20/16.
 */
import React, {Component, Image, View, StyleSheet,Animated, Text, TouchableOpacity,findNodeHandle,PanResponder} from 'react-native';
import Order from 'react-native-order-children';

import MapboxGG from 'react-native-mapbox-gl';
import Button from 'react-native-button';
import SimpleMarker from './markers/SimpleMarker';
import GPSLocation from './GPSLocation'; 
import compose from 'recompose/compose';

import Utilsmap from './utils';
var RCTUIManager = require('NativeModules').UIManager;
const MAP_REF = 'map';
const STYLE_URL = 'http://ns327841.ip-37-187-112.eu:8080/1.json';

const WIDTH_MAP =100;
const HEIGHT_MAP =100;
const PY =0;
const BOUNDS ={};
import defaultProps from 'recompose/defaultProps';

//function to interpolate between range of number (used for convertion pixel to latlng and reverse
const siminterpolate = (input: number, inputRange: Array < number > , outputRange: Array < number > ) => {
    function findRange(input: number, inputRange: Array < number > ) {
        for (var i = 1; i < inputRange.length - 1; ++i) {
            if (inputRange[i] >= input) {
                break;
            }
        }
        return i - 1;
    }
    var range = findRange(input, inputRange);
    inputMin = inputRange[range];
    inputMax = inputRange[range + 1];
    outputMin = outputRange[range];
    outputMax = outputRange[range + 1];

    result = (input - inputMin) / (inputMax - inputMin);
    result = result * (outputMax - outputMin) + outputMin;
    return result;
}
   //our custom Marker
const Marker = props => { 
return (
<SimpleMarker key={props.index} source={props.src} style={{position:'absolute',left:props.coord.x,top:props.coord.y}} />
)
};
//for different type of Marker hotel,resto ...
const Marker_hotel = defaultProps({
  src: 'mapIcon-hotel.png'
  });
const Marker_chalet = defaultProps({
  src: 'mapIcon-chalet.png'
  });
const Marker_resto = defaultProps({
  src: 'mapIcon-resto.png'
  });
  
  let nbmarker = 0;
  
// yes compose is hard to understand (he allow to merge properties together and apply this props to a 'template' Marker
//createMarker take object (x,y) ; type (ex chalet) string 
 const createMarker = (lacoord, type, key) => {
     nbmarker++;
     key = nbmarker;
     if (type == "resto") {
         Composed = compose(
             defaultProps({
                 coord: lacoord,
                 index: key
             }),
             Marker_resto)(Marker);
     } else if (type == "chalet") {
         Composed = compose(
             defaultProps({
                 coord: lacoord,
                 index: key
             }),
             Marker_chalet)(Marker);
     } else {
         Composed = compose(
             defaultProps({
                 coord: lacoord,
                 index: key
             }),
             Marker_hotel)(Marker);
     }
     return Composed;
 };
  
var MapPage = React.createClass({
  packages:[],
  
  //see ./utils.js i mixed lot of function here to have a smaller file 
  mixins: [MapboxGG.Mixin,Utilsmap],
  //
  
  ///
  Layer_markers:[{x:0,y:0},{x:0,y:200},{x:175,y:0},{x:175,y:200}],
  
  //the
  _panResponder: {},
  _previousLeft: 0,
  _previousTop: 0,
  _LayerStyles: {},
  Layermarker: (null : ?{ setNativeProps(props: Object): void }),
  
  getInitialState() {
    return {
    index:0,
    Layout: [ ],
    TypeMarker:'resto',
      mapLocation: {
        latitude: 0,
        longitude: 0
      },
      initMap:false,
      center: {
        latitude: 45.3007, longitude: 6.5800
      }, 
      annotations: [{
        coordinates: [45.3007, 6.5800],
        'type': 'point',
        title: 'Me',
        subtitle: 'It has a rightCalloutAccessory too',
        rightCalloutAccessory: {
          url: 'https://cldup.com/9Lp0EaBw5s.png',
          height: 25,
          width: 25
        },
        annotationImage: {
          url: 'https://cldup.com/CnRLZem9k9.png',
          height: 25,
          width: 25
        },
        id: 'position_user'
      }],
      zoom: 15,
      direction: 0,
    }
  }, 

   insertMarker: function(posx, posy, type) {
         Item = createMarker({
             x: posx,
             y: posy
         }, type);
         this.state.Layout.push( <
             Item key = {
                 this.state.index
             }
             />
         )
         this.setState({
             index: this.state.index + 1,
             Layout: this.state.Layout
         })
     },
     componentWillMount: function() {
         this._panResponder = PanResponder.create({
             onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
             onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
             onPanResponderGrant: this._handlePanResponderGrant,
             onPanResponderMove: this._handlePanResponderMove,
             onPanResponderRelease: this._handlePanResponderEnd,
             onPanResponderTerminate: this._handlePanResponderEnd,
         });
         this._LayerStyles = {
             style: {
                 backgroundColor: 'transparent'
             }
         };

     },

     componentDidMount() {
         this._updateNativeStyles();

         setTimeout(() => {
             this.getBounds(MAP_REF, this.callbacksim);

             //load the pack for the location of user, select the resort 
             // and put off line data in memory
             this.loadOfflinePackages();

         }, 500);
     },
  
callbacksim(bounds) {
    BOUNDS = bounds;
    console.log('callbacksim');
    //function to get exact with,height and position of our map 
    var handle = findNodeHandle(this.refs[MAP_REF]);
    RCTUIManager.measure(handle, (ox, oy, width, height, px, py) => {
        WIDTH_MAP = width;
        HEIGHT_MAP = height;
        PY = py;
        console.log("ox: " + ox);
        console.log("oy: " + oy);
        console.log("width: " + width);
        console.log("height: " + height);
        console.log("px: " + px);
        console.log("py: " + py);
        //Do stuff with the values
    });
    // this.props.Layer_markers=[{x:0,y:0},{x:0,y:HEIGHT_MAP},{x:WIDTH_MAP,y:0},{x:WIDTH_MAP,y:HEIGHT_MAP}];
    //->TODO redraw view ? implement in redux??
},
  getLatLgtFrompoint(pt){  
  return this.convert({x:pt.x,y:pt.y},WIDTH_MAP,HEIGHT_MAP);
  },
	convert(coord, width_map, height_map) {
        //convert coord (x,y) to (lat,lon)
        //or convert coord (lat,lon) to (x,y)
        //coord is object point {x,y} 
        //the point is the relative position of marker on the map view
        // RCTUIManager.measure upper calculate width_map,height_map need in this function

        // we can correspond the data pixel x,y, with latitude of point of Layer_markers 
        /* 
        ex bounds start with
               {ne_lat: 45.3051,
               ne_lon: 6.58401,
               sw_lat: 45.2961,
               sw_lon: 6.57591}
                
                for a map with 
                {ne_x:0,
                ne_y:0,
                sw_x:width_map,
                sw_y:height_map)
                
               lat== ligne of data from nord to sud
               lont == ligne of data from west to est
               =>then
               ne_lon==se_lon
               nw_lon==sw_lon
               
               nw_lat==ne_lat
               sw_lat==se_lat
               
               so (0,0) 		 pixel position -> 		 (nw_lat,nw_lon) == (45.3051,6.57591)
               so (0,width_map) pixel position -> 		 (nw_lat,ne_lon) == (45.3051,6.58401)
               pixel position (height_map,0)  -> 		 (sw_lat,nw_lon) == (45.2961,6.57591)
               pixel position (height_map,width_map) -> (sw_lat,ne_lon) == (45.2961,6.58401)
             */
		//BOUNDS is our map bounds
        console.log(BOUNDS);
        ne_lon = BOUNDS[3];
        ne_lat = BOUNDS[2];
        sw_lat = BOUNDS[0];
        sw_lon = BOUNDS[1];
        se_lon = ne_lon;
        se_lat = sw_lat;
        nw_lon = sw_lon;
        nw_lat = ne_lat;
        if (typeof(coord.lat) !== 'undefined') {
            valuex = siminterpolate(coord.lat, [nw_lon, ne_lon], [0, width_map]);
            valuey = siminterpolate(coord.lon, [nw_lat, sw_lat], [0, height_map]);
            return {
                x: valuex,
                y: valuey
            };
        } else { 
            valuelon = siminterpolate(coord.x, [0, width_map], [nw_lon, ne_lon]);
            valuelat = siminterpolate(coord.y, [0, height_map], [nw_lat, sw_lat]);
            return {
                lon: valuelon,
                lat: valuelat
            };
        }
    },


    onLayoutloaded(obj, scene) {
        //console.info(obj);  
    },
    putTypeMarker(typ) {
        this.setState({
            TypeMarker: typ
        })
    },
MyLayoutofMarkers(t) {
      return(
        <View order={4} style={{position:'absolute',left:0,top:0,width:400,height:400}}  ref={(Layermarker) => {
            this.Layermarker = Layermarker;
          }} {...this._panResponder.panHandlers} >	
          {t}
         </View>
      )           
    },
  addNewMarker(e) { 
  //PY is the position-top of the map we need to substrate it to correct the value y
  console.log('inser'+PY);
  if (typeof(e)!=='undefined')
  this.insertMarker(e.pageX,(e.pageY-PY),this.state.TypeMarker); 
  else
  console.log('prob_insertion out of view maybe?');
  
  pt={x:e.pageX,y:(e.pageY-PY)};
  //below to check my function convert work good (no need)
  res=this.getLatLgtFrompoint(pt); 
    let newMarker = {
      coordinates: [res.lat,res.lon],
      type: 'point',
      title: 'This is a new marker',
      id: 'foo'
    };
    this.addAnnotations(MAP_REF, [newMarker]);
  },

  setMapZoom(targetZoom) {
    this.setZoomLevelAnimated(MAP_REF, targetZoom);
  },

  zoomIn() {
    this.setState({
      zoom: this.state.zoom-1
    });
  },

  zoomOut() {
    this.setState({
      zoom: this.state.zoom + 1
    });
  },

  onChange(e) {
    this.setState({ mapLocation: e });
  },

  onOpenAnnotation(annotation) {
    console.log(annotation)
  },

  onUpdateUserLocation(location) {
    console.log(location)
  },

  onOpenAnnotation(annotation) {
  },

  removeAllMapPackages() {
    //this.removeAllPackages('map', (res, res1)=>{
    //});
  },
   _highlight: function() {
    this._LayerStyles.style.backgroundColor = 'blue';
    this._updateNativeStyles();
  },

  _unHighlight: function() {
    this._LayerStyles.style.backgroundColor = 'transparent';
    this._updateNativeStyles();
  },
    _updateNativeStyles: function() {
    this.Layermarker && this.Layermarker.setNativeProps(this._LayerStyles);
  },

  _handleStartShouldSetPanResponder: function(e: Object, gestureState: Object): boolean {
    // Should we become active when the user presses down on the circle?
    this.addNewMarker(e.nativeEvent,this.state.typeselected);
    return true;
  },
  _handleMoveShouldSetPanResponder: function(e: Object, gestureState: Object): boolean {
    // Should we become active when the user moves a touch over the circle?
    return true;
  },

  _handlePanResponderGrant: function(e: Object, gestureState: Object) {
    this._highlight();
    return true;
  },
  _handlePanResponderMove: function(e: Object, gestureState: Object) { 
   // this._updateNativeStyles();
  },
  _handlePanResponderEnd: function(e: Object, gestureState: Object) {
    this._unHighlight(); 
  },
  
    
  render() { 
  /* 
     {  
          this.Layer_markers.map(function(marker, index) {
          console.log({left:marker.x,top:marker.y});
          return createMarker({x:marker.x,y:marker.y},'hotel',index);
        }        )
        }
          */
    return (    
      <View style={styles.pageContainer}>           
        <Text onPress={() => this.loadOfflinePackages('Valthorens')}>
          Get offline coordonate pack val thorens
        </Text>

        <Text onPress={() => this.loadOfflinePackages('Meribel')}>
          Get offline coordonate pack meribel
        </Text>
			<View style={{flexDirection:'row'}}>
        		<View style={{flexDirection:'column'}}>
          <Text onPress={()=>this.putTypeMarker('resto')} style={{width:50,backgroundColor:'green'}}>
            Do resto marker
          </Text>
          <Text onPress={()=>this.putTypeMarker('chalet')} style={{width:50,backgroundColor:'blue'}}>
            Do chalet marker
          </Text>
          <Text onPress={()=>this.putTypeMarker('hotel')} style={{width:50,backgroundColor:'red'}}>
            Do hotel marker
          </Text>
          </View>
           <View style={styles.mapInformation} >
            <GPSLocation
              {...this.props}
              ref="gpsLocation"
            />
            <Text>Latitude: {this.state.mapLocation.latitude}</Text>
            <Text>Longitude: {this.state.mapLocation.longitude}</Text>
            <Text>zoom level: {this.state.mapLocation.zoom}</Text>
          </View>
        </View> 
       
   <Order>
   {this.MyLayoutofMarkers(this.state.Layout)} 
   
          <TouchableOpacity
            order={2}
            onPress={()=>this.setMapZoom(6)}>
            <Text>
              Zoom out to zoom level 6
            </Text>
          </TouchableOpacity>

          <Button
            order={2}
            containerStyle={[styles.zoomButtonContainer, {top: 34}]}
            style={styles.btnZoom}
            onPress={()=>{this.zoomIn()}}
          >
            +
          </Button>

          <Button
            order={2} containerStyle={styles.zoomButtonContainer}
            style={styles.btnZoom}
            onPress={()=>{this.zoomOut()}}
          >
            -
          </Button>
 

          <View
            order={2}
            style={styles.mapInformation2}
          >
            <Text>Latitude: {this.state.mapLocation.latitude}</Text>
            <Text>Longitude: {this.state.mapLocation.longitude}</Text>
            <Text>zoom level: {this.state.mapLocation.zoom}</Text>
          </View>
		 
          <MapboxGG
            order={1}
            style={styles.map}
            direction={0}
            rotateEnabled={false}
            scrollEnabled={true}
            zoomEnabled={true}
            showsUserLocation={true}
            followUserLocation={true}
            logoIsHidden={true}
            ref={MAP_REF}
            accessToken={'pk.eyJ1Ijoic2ltb25tYXAiLCJhIjoiY2luNHcyMjhnMDBzMnZxbTI5NGNjN3hxbyJ9.OQmEh5-9T3Og_0qE9dRlQg'}
            styleURL={STYLE_URL}
            centerCoordinate={this.state.center}
            zoomLevel={this.state.zoom}
            direction={this.state.direction}
            annotations={this.state.annotations}
            onRegionChange={this.onChange}
            onOpenAnnotation={this.onOpenAnnotation}
            onUpdateUserLocation={this.onUpdateUserLocation}
			onLayout={this.onLayoutloaded}
            onOfflineProgressDidChange={(res)=>this.onSavePackageOfflineProgress(res)}
            onOfflineMaxAllowedMapboxTiles={(res)=>this.onSavePackageOfflineError(res)}
            attributionButtonIsHidden
          >  
          </MapboxGG>
         
        </Order>
      </View>
    )

  }
});

let styles = StyleSheet.create({
  pageContainer: {
    backgroundColor: '#9DD6EB',
    flex: 1
  },
  map: {
    flex: 1
  },
  zoomButtonContainer:{
    position:'absolute',
    right:0,
    top:0,
    padding:2,
    width: 32,
    height:32,
    overflow:'hidden',
    borderRadius:4,
    backgroundColor: 'transparent'
  },
  btnZoom: {
    borderWidth: 1,
    borderColor: 'blue',
    backgroundColor: 'white'
  },
  mapInformation: { 
 width:280,
    backgroundColor:'white'
  },
  mapInformation2: {
    position:'relative',
    top:0,
    left:0,
    width:200,
    backgroundColor:'white'
  }
});

export default MapPage;