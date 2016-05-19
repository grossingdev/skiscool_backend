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
    apiResult: {
      error_code: 0,
      msg: ''
    },
    map_status: {
      markerStyle: 0,
      placeMarkers: []
    },
    ui_status: {
      sidebar: 0,
      pageIndex: 0,
      showPackageDialog: false,
      apiWaitingStatus: false
    },
  };
};

export default defaultValues();
