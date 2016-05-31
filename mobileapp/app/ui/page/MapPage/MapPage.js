/**
 * Created by baebae on 4/20/16.
 */
import React, {Component, Image, View, StyleSheet,Animated, Text, TouchableOpacity, findNodeHandle, PanResponder} from 'react-native';
import Order from 'react-native-order-children';
import {isEqual} from 'lodash';
import MapboxGG from 'react-native-mapbox-gl';
import Button from 'react-native-button';
import SimpleMarker from './markers/SimpleMarker';
import GPSLocation from './GPSLocation'; 
import compose from 'recompose/compose';
import {MapboxUtils, convertXYLatLng} from './mapboxUtils';
import generateUUID from '../../../utils/uuid';
import Triangle from 'react-native-triangle';

var RCTUIManager = require('NativeModules').UIManager;
const MAP_REF = 'map';
const STYLE_URL = 'http://ns327841.ip-37-187-112.eu:8080/1.json';

import defaultProps from 'recompose/defaultProps';

//our custom Marker
const Marker = (props) => {
  return (
    <SimpleMarker
      key={props.index} source={props.src}
      style={{position:'absolute', left:props.coord.x, top:props.coord.y}}
      onPress={props.onPress}
    />
  )
};

//for different type of Marker hotel,resto ...
const Marker_hotel = defaultProps({src: 'mapIcon-hotel.png'});
const Marker_chalet = defaultProps({src: 'mapIcon-chalet.png'});
const Marker_resto = defaultProps({src: 'mapIcon-resto.png'});
  
let nbmarker = 0;
  
// yes compose is hard to understand (he allow to merge properties together and apply this props to a 'template' Marker
//createMarker take object (x,y) ; type (ex chalet) string 
const createMarker = (coord, type, key, onPress) => {
  nbmarker++;
  key = nbmarker;
  let Composed = null;

  if (type == 3) {
    Composed = compose(defaultProps({
      coord: coord,
      index: key,
      onPress
    }), Marker_resto)(Marker);
  } else if (type == 2) {
    Composed = compose(defaultProps({
      coord: coord,
      index: key,
      onPress
    }), Marker_chalet)(Marker);
  } else if (type == 1) {
    Composed = compose(defaultProps({
      coord: coord,
      index: key,
      onPress
    }), Marker_hotel)(Marker);
  }
  return Composed;
};
  
var MapPage = React.createClass({
  packages:[],
  
  //see ./utils.js i mixed lot of function here to have a smaller file 
  mixins: [MapboxGG.Mixin, MapboxUtils],
  Layer_markers:[{x:0,y:0}, {x:0,y:200}, {x:175,y:0}, {x:175,y:200}],
  
  //the
  _panResponder: {},
  _previousLeft: 0,
  _previousTop: 0,
  _LayerStyles: {},
  Layermarker: null,
  startTouchTime: 0,
  releaseTouchTime: 0,
  flagDoubleTouch: false,

  mapBounds: {},
  flagAddMarkerProgressing : false,
  getInitialState() {
    return {
      mapWidth: 400,
      mapHeight: 400,
      py: 0,
      index:0,
      layerMarkers: [ ],
      markerStyle: 1, //hotel: 1, chalet: 2, restaurant: 3, ...
      mapLocation: {
        latitude: 0,
        longitude: 0
      },
      initMap:false,
      center: {
        latitude: 45.3007, longitude: 6.5800
      },
      activeMarker: {
        overlay_uuid: '',
        left: 0,
        top: 0,
        flagUpdate: false,
        flagShow: false,
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
      zoom: 12,
      direction: 0,
    }
  },

  showMarkerOverlay(overlay_uuid, left, top) {
    this.setState({
      activeMarker: {overlay_uuid, left, top, flagShow: true, flagUpdate: false}
    })
  },

  hideMarkerOverlay() {
    let {activeMarker} = this.state;
    activeMarker.flagShow = false;
    this.setState({activeMarker});
  },

  addLayerMarker(x, y, type, overlay_uuid) {
    let {layerMarkers, index} = this.state;
    let onPress = ()=>{this.showMarkerOverlay(overlay_uuid, x, y)};
    let Item = createMarker({x, y}, type, index, onPress);
    layerMarkers.push(<Item key = {this.state.index} />);
    index ++;
    this.setState({index, layerMarkers});
  },

  componentWillMount: function() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    });
    this._LayerStyles = {style: { backgroundColor: 'transparent'}};
  },

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.placeMarkers, nextProps.placeMarkers) || this.props.markerStyle != nextProps.markerStyle) {
      this.addPlaceMarkers(nextProps);
    }
  },

  addPlaceMarkers(props) {
    if (this.flagAddMarkerProgressing) {
      return
    }
    this.flagAddMarkerProgressing = true;
    let index = 0;
    let layerMarkers = [];
    this.setState({index, layerMarkers});
    this.getMapViewSize()
      .then(() => {
        _.forEach(props.placeMarkers, (marker) => {
          this.addNewMarkerFromLocation(marker);
        });
        this.flagAddMarkerProgressing = false;
      })
  },
  
  getMapViewSize() {
    return new Promise((resolve, reject) => {
        this.getBounds(MAP_REF, (bounds) => {
          this.mapBounds = bounds;
          var handle = findNodeHandle(this.refs[MAP_REF]);
          RCTUIManager.measure(handle, (ox, oy, mapWidth, mapHeight, px, py) => {
            this.mapWidth = mapWidth;
            this.mapHeight = mapHeight;
            this.py = py;
            this.setState({
              mapWidth, mapHeight, py
            });
            // console.log("ox: " + ox);
            // console.log("oy: " + oy);
            // console.log("width: " + mapWidth);
            // console.log("height: " + mapHeight);
            // console.log("px: " + px);
            // console.log("py: " + py);
            resolve();
            //Do stuff with the values
          });
        });
    });
  },

  componentDidMount() {
    this._updateNativeStyles();
    setTimeout(() => {
      this.getMapViewSize();
      //load the pack for the location of user, select the resort
      // and put off line data in memory
      this.loadOfflinePackages();
    }, 500);
  },
  
  getLatLngFromPoint(position) {
    return convertXYLatLng(position, this.mapWidth, this.mapHeight, this.mapBounds);
  },

  renderMarkerOverlay() {
    let {overlay_uuid, left, top, flagShow} = this.state.activeMarker;
    let width = 200;
    let height = 60;
    left = left - width / 2;
    top = top - height - 30;
    if (flagShow == true) {
      return (
        <View style={{position:'absolute', left, top, width, height, flexDirection: 'column', alignItems: 'center'}}>
          <View style={styles.markerOverlayContainer}>
            <TouchableOpacity style={styles.markerOverlayButton} onPress={()=>{this.removeMarker()}}>
              <Text>Remove</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.markerOverlayButton} onPress={()=>{this.updateMarker()}}>
              <Text>Update</Text>
            </TouchableOpacity>
          </View>
          <Triangle
            width={12}
            height={10}
            color={'white'}
            direction={'down'}
          />
        </View>
      )
    }
  },
  MyLayoutofMarkers(layerMarkers) {
    return(
      <View
        order={2} style={{position:'absolute',left:0,top: 0, width: this.state.mapWidth, height: this.state.mapHeight}}
        ref={(Layermarker) => {
          this.Layermarker = Layermarker;
        }}
        {...this._panResponder.panHandlers}
      >
        <MapboxGG
          order={2}
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
          onOfflineProgressDidChange={(res)=>this.onSavePackageOfflineProgress(res)}
          onOfflineMaxAllowedMapboxTiles={(res)=>this.onSavePackageOfflineError(res)}
          attributionButtonIsHidden
        />
        {layerMarkers}
        {this.renderMarkerOverlay()}
      </View>
    )
  },

  addNewMarkerFromPosition(e) { 
    //PY is the position-top of the map we need to substrate it to correct the value y
    this.getMapViewSize()
      .then(()=> {
        console.log('addNewMarkerFromPosition' + this.state.py);
        let x = e.pageX;
        let y = e.pageY - this.state.py;

        let res = this.getLatLngFromPoint({x, y});

        if (this.state.activeMarker.flagUpdate == false) {
          this.props.addNewPlaceMarker({
            overlay_type: this.state.markerStyle,
            location: [res.lat,res.lon],
            overlay_uuid: generateUUID()
          });
        } else {
          this.props.updatePlaceMarker({
            overlay_uuid: this.state.activeMarker.overlay_uuid,
            location: [res.lat,res.lon],
          });
          this.setState({activeMarker: {flagUpdate: false}})
        }

    });
  },

  removeMarker() {
    if (this.state.activeMarker.overlay_uuid != '') {
      this.props.removePlaceMarker(this.state.activeMarker.overlay_uuid);
    }
    this.hideMarkerOverlay();
  },

  updateMarker() {
    let {activeMarker} = this.state;
    activeMarker.flagShow = false;
    activeMarker.flagUpdate = true;
    this.setState({activeMarker});
  },

  addNewMarkerFromLocation(marker) {
    let lat = marker.location[0];
    let lon = marker.location[1];

    let newMarker = {
      coordinates: [lat, lon],
      type: 'point',
      title: 'This is a new marker',
      id: 'foo'
    };
    this.addAnnotations(MAP_REF, [newMarker]);

    let res = this.getLatLngFromPoint({lat, lon});
    if (res.y > 30) {
      this.addLayerMarker(res.x, res.y, marker.overlay_type, marker.overlay_uuid);
    }
  },

  setMapZoom(targetZoom) {
    this.setZoomLevelAnimated(MAP_REF, targetZoom);
  },

  zoomIn() {
    this.setState({
      zoom: this.state.zoom - 1
    });
    this.addPlaceMarkers(this.props);
  },

  zoomOut() {
    this.setState({
      zoom: this.state.zoom + 1
    });
    this.addPlaceMarkers(this.props);
  },

  onChange(e) {
    this.setState({ mapLocation: e });
    this.addPlaceMarkers(this.props);
  },

  onUpdateUserLocation(location) {
    // console.log(location)
  },

  onOpenAnnotation(annotation) {
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
    return true;
  },
  _handleMoveShouldSetPanResponder: function(e: Object, gestureState: Object): boolean {
    // Should we become active when the user moves a touch over the circle?
    return true;
  },

  _handlePanResponderGrant: function(e: Object, gestureState: Object) {
    console.info('start', new Date().toString());
    this.startTouchTime = new Date().getTime();

    this.hideMarkerOverlay();

    if (this.startTouchTime - this.releaseTouchTime < 500) {
      this.flagDoubleTouch = true;
    } else {
      this.flagDoubleTouch = false;
    }
    this._highlight();
    return true;
  },

  _handlePanResponderEnd: function(e: Object, gestureState: Object) {
    this.releaseTouchTime = new Date().getTime();
    this._unHighlight();

    let delta = this.releaseTouchTime - this.startTouchTime;
    console.info('delta', delta + ' ' + this.flagDoubleTouch);
    if (delta < 300 && !this.flagDoubleTouch) {
      this.startTouchTime = this.releaseTouchTime;
      this.addNewMarkerFromPosition(e.nativeEvent,this.state.typeselected);
    }
  },
  
  render() {
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
            <Text onPress={()=>this.setState({markerStyle: 3})} style={{width:50,backgroundColor:'green'}}>
              Do resto marker
            </Text>
            <Text onPress={()=>this.setState({markerStyle: 2})} style={{width:50,backgroundColor:'blue'}}>
              Do chalet marker
            </Text>
            <Text onPress={()=>this.setState({markerStyle: 1})}style={{width:50,backgroundColor:'red'}}>
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
          {this.MyLayoutofMarkers(this.state.layerMarkers)}

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
            onPress={() => {this.zoomIn()}} >
            {"+"}
          </Button>

          <Button
            order={2} containerStyle={styles.zoomButtonContainer}
            style={styles.btnZoom}
            onPress={()=>{this.zoomOut()}} >
            {"-"}
          </Button>

          <View
            order={2}
            style={styles.mapInformation2}
          >
            <Text>Latitude: {this.state.mapLocation.latitude}</Text>
            <Text>Longitude: {this.state.mapLocation.longitude}</Text>
            <Text>zoom level: {this.state.mapLocation.zoom}</Text>
          </View>
		 

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
  },
  markerOverlayContainer: {
    flex: 1,
    padding: 10,
    alignSelf: 'stretch',
    backgroundColor:'white',
    flexDirection: 'row',
    borderRadius: 10,
    height: 40
  },
  markerOverlayButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default MapPage;