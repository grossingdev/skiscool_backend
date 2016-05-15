/**
 * Created by baebae on 4/20/16.
 */
import React, {Component, Image, View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Order from 'react-native-order-children';

import MapboxGG from 'react-native-mapbox-gl';
import Button from 'react-native-button';
import GPSLocation from './GPSLocation';

const IS_ADMIN = true;
const MAP_REF = 'map';

const PACKAGE_VALTHORENS = {
  ne_lat: 45.30532577720797,
  ne_lon: 6.584441693272964,
  sw_lat: 45.29607384535825,
  sw_lon: 6.575558306727146
};

const PACKAGE_MERIBEL= {
  ne_lat: 6.30532577720797,
  ne_lon: 6.584441693272964,
  sw_lat: 6.29607384535825,
  sw_lon: 6.575558306727146
};

var MapPage = React.createClass({
  packages:[],
  mixins: [MapboxGG.Mixin],

  getInitialState() {
    return {
      mapLocation: {
        latitude: 0,
        longitude: 0
      },
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

  componentDidMount() {
    setTimeout(()=>{
      this.loadOfflinePackages();
    }, 500);
  },

  addResortBoundPackage(package_obj,name_region) {
    /*
      NIKO
      save bound and resort in database for admin..
    */
    console.info("resort: ",name_region , "saved");
    this.packages[name_region]=package_obj;
  },

  loadOfflinePackageforresort(packs, loadResortName) {
    /*
     delete it and replace get_dataresortfrom_datatbase NIKO
    */

    let resortName = "";
    if (!loadResortName) {
      //user not in resort
      console.log("Check pack resort " + loadResortName + " in memory/database");
      console.log(this.props.deviceInfo.initLoc);

      let location = this.props.deviceInfo.initLoc.coords;
      let lon = 0;
      let lat = 0;
      if (location) {
        lon= location.longitude;
        lat= location.latitude;
        console.info('User GeoLocation:',location);
      }

      if (this.packages.length == 0){
        /*
         first load database with some value
         this.getindatabase
         */
        //just some value to test(because still not databased)
        this.packages['Valthorens']= PACKAGE_VALTHORENS;
        this.packages['Meribel']= PACKAGE_MERIBEL;
      }

      /*
       for each resort check if the user is in this resort
       if yes select the resort found
       */
      _.forEach(this.packages, (value, key) => {

        if((lon <= value.ne_lon && lon >= value.sw_lon)&&
           (lat <= value.ne_lat && lat>=value.sw_lat)){
          resortName = key;
        }
      });
    } else {
      resortName = loadResortName;
    }

//
    let flagResortCached = false;
    if (resortName.length > 0) {
      console.info("user is in "+ resortName);
      for (let pack of packs) {
        console.log("pack name: "+ pack.name);
        if (resortName == pack.name) {
          flagResortCached = true;
          console.info("found in memory", resortName);
          break;
        }
      }
    } else {
      resortName = "Valthorens"; //in test
      this.loadOfflinePackageforresort(packs,resortName); //
    }
    /*
      if resort not cached && for client only
      if device connected (wifi/gprs)
      //NIKO //implement a dialog showing download offline-pack for user
    */

    if (flagResortCached == false && !IS_ADMIN){
        this.saveMapPackage(resortName, this.props.packageRegion);
        console.log("please wait we downloading pack");
    }
    //->We need implement get resort data from database and display it
    //to avoid download map
  },

  loadOfflinePackages(resortName) {
    //get the bounds from current;

    console.info("current bound", this.props.packageRegion);
    this.prepareMapPackage();
    //check memory for packs and work on it

    this.getPacks('map', (res, packs)=>{
      this.loadOfflinePackageforresort(packs,resortName);
    });
  },

  prepareMapPackage() {
    this.getBounds('map', (bounds) => {
      let res = {
        ne_lat: bounds[2],
        ne_lon: bounds[3],
        sw_lat: bounds[0],
        sw_lon: bounds[1],
      }
      this.props.setMapPackageRegion(res);
    });
  },

  saveMapPackage(packageName, region) {
    this.addPackForRegion('map', {
      name: packageName,
      bounds: [region.ne_lat, region.ne_lon, region.sw_lat, region.sw_lon],
      minZoomLevel: 1,
      maxZoomLevel: 18,
      type: 'bbox',
      styleURL: 'http://webapp.sesh.io/1.json',
      metadata: {}
    }, (err,res1)=>{
      console.info("package saved in device:", res1);
      console.info(err);
      console.info(region);
    });
  },

  saveAdminMapPackage(packageName, region) {

    let component = this;
    console.info("saveMapPackage", packageName);
    this.removePack('map', packageName, (res, res1)=>{
      console.info("remove pack", res1);
    });

    this.addPackForRegion('map', {
      name: packageName,
      bounds: [region.ne_lat, region.ne_lon, region.sw_lat, region.sw_lon],
      minZoomLevel: 1,
      maxZoomLevel: 18,
      type: 'bbox',
      styleURL: 'http://webapp.sesh.io/1.json',
      metadata: {}
    }, (err,res1)=>{
      //callback after save in device to save bounds and name in database.
      console.info("package saved in device:", res1);
      console.info(region);
      if (err) {
        console.info(err);
      }
      else {
        component.addResortBoundPackage({
          ne_lat:region.ne_lat,
          ne_lon:region.ne_lon,
          sw_lat:region.sw_lat,
          sw_lon:region.sw_lon
        }, res1);
      }

    });

    this.props.updatePackageRunningStatus(true);
  },

  onSavePackageOfflineProgress(res) {
    let completedCount = res.countOfResourcesCompleted;
    let totalCount = res.countOfResourcesExpected;
    let totalSize = res.countOfBytesCompleted / 1024.0 / 1024.0;

    let message = "Package map files: " + completedCount + "/" + totalCount + "\nSize:" + totalSize.toFixed(2) + "MB";
    let flagDownloadingPackage = true;
    if (totalCount == completedCount) {
      flagDownloadingPackage = false;
    }
    this.props.updatePackageRunningStatus(flagDownloadingPackage);
    this.props.updatePackageStatusMessage(message);
  },

  onSavePackageOfflineError(res) {
    console.info("onSavePackageOfflineError", res);
  },

  addNewMarker() {
    let newMarker = {
      coordinates: [45.3007,6.5800],
      type: 'point',
      title: 'This is a new marker',
      id: 'foo'
    };
    this.addAnnotations(MAP_REF, [newMarker])
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

  render() {
    return (
      <View style={styles.pageContainer}>

        <Text onPress={() => this.loadOfflinePackages('Valthorens')}>
          Get offline coordonate pack val thorens
        </Text>

        <Text onPress={() => this.loadOfflinePackages('Meribel')}>
          Get offline coordonate pack meribel
        </Text>

        <TouchableOpacity onPress={()=>this.addNewMarker()}>
          <Text>
            Create New Marker
          </Text>
        </TouchableOpacity>

        <Order>
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
            style={styles.mapInformation}
          >
            <GPSLocation
              {...this.props}
              ref="gpsLocation"
            />
            <Text>Latitude: {this.state.mapLocation.latitude}</Text>
            <Text>Longitude: {this.state.mapLocation.longitude}</Text>
            <Text>zoom level: {this.state.mapLocation.zoom}</Text>
          </View>

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
            styleURL={'http://webapp.sesh.io/1.json'}
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
    position:'absolute',
    top:0,
    left:0,
    width:370,
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