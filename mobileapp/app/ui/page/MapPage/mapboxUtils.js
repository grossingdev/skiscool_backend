const IS_ADMIN = true;
const MAP_REF = 'map';
const STYLE_URL = 'http://ns327841.ip-37-187-112.eu:8080/1.json';

const PACKAGE_VALTHORENS = {
  ne_lat: 45.30532577720797,
  ne_lon: 6.584441693272964,
  sw_lat: 45.29607384535825,
  sw_lon: 6.575558306727146
};

const PACKAGE_MERIBEL = {
  ne_lat: 6.30532577720797,
  ne_lon: 6.584441693272964,
  sw_lat: 6.29607384535825,
  sw_lon: 6.575558306727146
};

export const MapboxUtils = {
  addResortBoundPackage(package_obj, name_region) {
    /*
      NIKO
      save bound and resort in database for admin..
    */
    console.info("resort: ", name_region, "saved");
    this.packages[name_region] = package_obj;
  },

  saveboundtoresort(package_obj,name_region) {
    //for user just put package_obj in memory
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
        lon = location.longitude;
        lat = location.latitude;
        console.info('User GeoLocation:', location);
      }

      if (this.packages.length == 0) {
        /*
         first load database with some value
         this.getindatabase
        */
        //just some value to test(because still not databased)
        this.packages['Valthorens'] = PACKAGE_VALTHORENS;
        this.packages['Meribel'] = PACKAGE_MERIBEL;
      }

      //  for each resort check if the user is in this resort
      //  if yes select the resort found

      _.forEach(this.packages, (value, key) => {
        if ((lon <= value.ne_lon && lon >= value.sw_lon) &&
           (lat <= value.ne_lat && lat >= value.sw_lat)) {
          resortName = key;
        }
      });
    } else {
      resortName = loadResortName;
    }

    let flagResortCached = false;
    if (resortName !== "") {
      console.info("user is in " + resortName);
      for (let pack of packs) {
        console.log("pack name: " + pack.name);
        if (resortName == pack.name) {
          flagResortCached = true;
          console.info("found in memory", resortName);
          break;
        }
      }
    } else {
      resortName = "Valthorens"; //current
      this.loadOfflinePackageforresort(packs, resortName); //
    }

    /*
      if resort not cached && for client only
      if device connected (wifi/gprs)
      //NIKO //implement a dialog showing download offline-pack for user
    */
    if (flagResortCached == false && !IS_ADMIN) {
      this.saveMapPackage(resortName, this.props.packageRegion);
      console.log("please wait we downloading pack");
    }
    //->We need implement get resort data from database and display it
    //to avoid download map
  },

  loadOfflinePackages(resortName) {
    //get the bounds from current;
    console.info("bound in state initial", this.props.packageRegion);
    this.prepareMapPackage();
    //check memory for packs and work on it

    this.getPacks('map', (res, packs) => {
      this.loadOfflinePackageforresort(packs, resortName);
    });
  },

  prepareMapPackage() {
    console.log('prepareMapPackage');
    this.getBounds('map', (bounds) => {
      let res = {
        ne_lat: bounds[2],
        ne_lon: bounds[3],
        sw_lat: bounds[0],
        sw_lon: bounds[1],
      }
      console.log('in->');
      console.log(bounds);
      console.log('out->');
      console.log(res);
      this.props.setMapPackageRegion(res);
      //->update this.props.packageRegion console.log(this.props.packageRegion);
    });
  },

  saveMapPackage(packageName, region) {
    let _self = this;
    let savePackageInformation = {
      name: packageName,
      bounds: [region.ne_lat, region.ne_lon, region.sw_lat, region.sw_lon],
      minZoomLevel: 1,
      maxZoomLevel: 18,
      type: 'bbox',
      styleURL: STYLE_URL,
      metadata: {}
    };

    this.addPackForRegion('map', savePackageInformation, (err, res1) => {
      console.info("package saved in device:", res1);
      console.info(region);
      if (err) {
        console.info('err', err);
      } else {
        _self.saveboundtoresort(region, res1);
      }
    });
  },

  saveAdminMapPackage(packageName, region) {
    let component = this;

    console.info("saveMapPackage", packageName);
    this.removePack('map', packageName, (res, res1) => {
      console.info("remove pack", res1);
    });

    let savePackageInfo = {
      name: packageName,
      bounds: [region.ne_lat, region.ne_lon, region.sw_lat, region.sw_lon],
      minZoomLevel: 1,
      maxZoomLevel: 18,
      type: 'bbox',
      styleURL: STYLE_URL,
      metadata: {}
    };
    this.addPackForRegion('map', savePackageInfo, (err, res1) => {
      //callback after save in device to save bounds and name in database.
      console.info("package saved in device:", res1);
      console.info(region);
      if (err) {
        console.info(err);
      } else {
        component.addResortBoundPackage(region, res1);
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
  console.log(mapBounds);
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

