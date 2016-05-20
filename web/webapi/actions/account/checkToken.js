import checkAuth from './checkAuth'
import statusCodeMessage from '../statusCodeMessage';

export default function checkToken(req) {
  return new Promise((resolve, reject) => {
    let {token} = req.body;
    checkAuth(token, true).then((user) => {
      return resolve({
        success: true,
        statusCode: 0,
        message: 'valid token',
        data: {
          'token': token,
          user: {
            'name': user.name,
            'email': user.email,
            'userType': user.userType
          }
        }
      });
    }, () => {
      let statusCode = 1015;
      return reject({
        success: false,
        msg: statusCodeMessage[statusCode],
        statusCode,
      });
    })
  });
}
