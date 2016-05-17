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
    }
  };
};

export default defaultValues();
