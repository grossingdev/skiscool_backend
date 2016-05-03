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
      loading: false
    }
  };
};

export default defaultValues();
