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
    }
  };
};

export default defaultValues();
