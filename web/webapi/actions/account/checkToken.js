import checkAuth from './checkAuth'
import statusCodeMessage from '../statusCodeMessage';

export default function checkToken(req) {
  return new Promise((resolve, reject) => {
    let {token} = req.body;
    checkAuth(token, true).then((user) => {
      let flagAdmin = false;
      if (user.flagAdmin) {
        flagAdmin = user.flagAdmin;
      }
      return resolve({
        success: true,
        statusCode: 0,
        msg: 'valid token',
        data: {
          'token': token,
          user: {
            'name': user.name,
            'email': user.email,
            'userType': user.userType,
            flagAdmin
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
