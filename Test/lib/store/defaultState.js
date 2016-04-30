const defaultValues = () => {
  return {
    socketClient: {
      connected: false,
      message: {
        type: '',
        data: ''
      }
    }
  };
};

export default defaultValues();
