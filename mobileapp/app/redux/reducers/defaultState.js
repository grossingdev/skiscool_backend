const defaultValues = () => {
  return {
    socketClient: {
      connected: false,
      message: {
        type: '',
        data: ''
      }
    },
    user: {
      auth: false,
      loading: false,
      token: '',
      profile: {}
    },
    apiInfo: {
      error_code: 0,
      msg: ''
    },
    deviceInfo: {
      lastLoc: {},
      initLoc: {},
      uuid: ""
    },
    ui_status: {
      sidebar: 0,
      pageIndex: 0,
      showPackageDialog: false,
      apiWaitingStatus: false
    },
    mapPackageInfo: {
      region: {
        ne_lat: 45.3051,
        ne_lon: 6.58401,
        sw_lat: 45.2961,
        sw_lon: 6.57591,
      },
      running: false,
      message: "",
    },
    apiResult: {
      error_code: 0,
      msg: ''
    },
    map_status: {
      markerStyle: 0,
      placeMarkers: []
    },
  };
};

export default defaultValues();
