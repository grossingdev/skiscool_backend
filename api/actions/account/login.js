import UserModel from '../../db/UserModel';
import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import config from '../../config';

export default function login(req) {
  return new Promise((resolve, reject) => {
    let {username, password} = req.body;
    if (!username) {
      // email address is absolutely necessary for user creation
      return reject({
        success: false,
        message: 'username required',
        data: {}
      });
      return;
    }

    if (!password) {
      return reject({
        success: false,
        message: 'password required',
        data: {}
      });
      return;
    }

    UserModel.findOne({username}, (err, user) => {
      //console.log('user found:  '+JSON.stringify(user));
      if (err) {
        reject({
          success: false,
          message: 'Error occured while checking if the user exists',
          data: {
            'error': err
          }
        });
        return;
      }
      if (user) {
        bcrypt.compare( password, user.password, (err, isMatch) => {
          if (err)  {
            console.log('error: ' + err );
            reject({
              success: false,
              message: 'Password is not correct',
              data: {
                'error': err
              }
            });
          }

          if (isMatch) {
            let token = jwt.sign({
                "id": user._id,
                "username": user.username,
              },
              config.jwt.secret, {
              expiresInMinutes: 1440 * 1260 * 360 // expires in 24 hours
            });
            req.session.token = token;
            resolve({
              success: true,
              message: 'login success',
              data: {
                'token_for': user.username,
                'token': token
              }
            });
          }
        });
      } else {
        reject({"message":"incorrect login"});

      }
    });//end find
  });
}
