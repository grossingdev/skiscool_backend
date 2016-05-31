import RNFS from 'react-native-fs';
const STYLE_URL = 'http://ns327841.ip-37-187-112.eu:8080/1.json';

export const MapboxUtils = {
  savePackageInfo: null,
  flagCompleted: true,

  removePackage(packName, flagRemoveAll, lastCount, resolve, reject) {
    this.removePack('map', packName, () => {
      if (flagRemoveAll) {
        this.removeAllPackage(lastCount, resolve, reject);
      }
    })
  },
  removeAllPackage(lastCount, resolve, reject) {
    this.getPacks('map', (res, packs) => {
      let count = packs.length;
      if (count == lastCount) {
        return reject && reject();
      }
      if (packs.length > 0) {
        return this.removePackage(packs[0].name, true, count, resolve, reject);
      } else {
        return resolve && resolve();
      }
    });
  },

  loadOfflinePackages() {
    this.getMapBoundary();
    this.getPacks('map', (res, packs) => {
      console.log(packs);
    });
  },

  getMapBoundary() {
    console.log('Get map boundary');
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

  saveMapBoxPackage(packageName, region) {
    this.removeAllPackage(-1, ()=> {
      console.info("saveMapPackage", packageName);
      this.removePack('map', packageName, (res, res1) => {
        console.info("remove pack", res1);
      });

      this.savePackageInformation = {
        name: packageName,
        bounds: [region.ne_lat, region.ne_lon, region.sw_lat, region.sw_lon],
        minZoomLevel: 13,
        maxZoomLevel: 15,
        type: 'bbox',
        styleURL: STYLE_URL,
        metadata: {}
      };
      this.flagCompleted = false;
      this.addPackForRegion('map', this.savePackageInformation, (err, res1) => {
      });
      this.props.updatePackageRunningStatus(true);
    }, () => {});
  },
  
  onSavePackageOfflineProgress(res) {
    let completedCount = res.countOfResourcesCompleted;
    let totalCount = res.countOfResourcesExpected;
    let totalSize = res.countOfBytesCompleted / 1024.0 / 1024.0;

    let message = "Package map files: " + completedCount + "/" + totalCount + "\nSize:" + totalSize.toFixed(2) + "MB";
    if (totalCount == completedCount && this.flagCompleted == false) {
      this.flagCompleted = true;

      let path = RNFS.ApplicationSupportDirectory + '/Skiscool.myapp/cache.db';
      RNFS.readFile(path, 'base64')
        .then((content) => {
          let requestInfo = Object.assign({}, this.savePackageInformation);
          console.info('saveBoundary', path + ' ' + JSON.stringify(this.savePackageInformation));
          requestInfo.base64Data = content;
          this.props.saveBoundary(requestInfo);
          this.props.updatePackageRunningStatus(false);
        })
        .catch((err) => {
          console.info('FILE READEN ', err.message);
        });
      this.props.updatePackageRunningStatus(false);
    } else {
      this.props.updatePackageRunningStatus(true);
      this.props.updatePackageStatusMessage(message);
    }

  },

  onSavePackageOfflineError(res) {
    console.info("onSavePackageOfflineError", res);
  }
};


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
};

export const convertXYLatLng = (coord, mapWidth, mapHeight, mapBounds) => {
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
  // console.log(mapBounds);
  ne_lon = mapBounds[3];
  ne_lat = mapBounds[2];
  sw_lat = mapBounds[0];
  sw_lon = mapBounds[1];
  se_lon = ne_lon;
  se_lat = sw_lat;
  nw_lon = sw_lon;
  nw_lat = ne_lat;

  if (typeof(coord.lat) !== 'undefined') {
    x = siminterpolate(coord.lon, [nw_lon, ne_lon], [0, mapWidth]);
    y = siminterpolate(coord.lat, [nw_lat, sw_lat], [0, mapHeight]);
    return {x, y};
  } else {
    lon = siminterpolate(coord.x, [0, mapWidth], [nw_lon, ne_lon]);
    lat = siminterpolate(coord.y, [0, mapHeight], [nw_lat, sw_lat]);
    return {lon, lat};
  }
};

