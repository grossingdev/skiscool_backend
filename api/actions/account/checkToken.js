import checkAuth from './checkAuth'

export default function checkToken(req) {
  return new Promise((resolve, reject) => {
    let {token} = req.body;
    checkAuth(token, true).then((user) => {
      return resolve({
        success: true,
        message: 'valid token',
        data: {
          'token': token,
          user: {
            'username': user.username
          }
        }
      });
    }, () => {
      return reject({
        success: false,
        message: 'invalid token',
      });
    })
  });
}
