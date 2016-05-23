import checkAuth from './checkAuth'
import statusCodeMessage from '../statusCodeMessage';

export default function checkToken(req, param) {
  return new Promise((resolve, reject) => {
    if (param && param.length > 0) {
      let token = param[0];
      checkAuth(token, true).then((user) => {
        return resolve({
          success: true,
          statusCode: 0,
          message: 'User verified successfully'
        });
      }, () => {
        let statusCode = 1015;
        return reject({
          success: false,
          msg: statusCodeMessage[statusCode],
          statusCode
        });
      })
    } else {
      let statusCode = 1015;
      return reject({
        success: false,
        msg: statusCodeMessage[statusCode],
        statusCode
      });
    }

  });
}
