import UserModel from '../../db/UserModel';
import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import config from '../../config';

export default function login(req) {
  return new Promise((resolve, reject) => {
    let {username, password, fromSocial} = req.body;
    if (fromSocial == 'default') {
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
          return reject({
            success: false,
            message: 'Error occured while checking if the user exists',
            data: {
              'error': err
            }
          });
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
                'expire': new Date().getTime() + 3600000 * 24 //one day
              }, config.jwt.secret);
              req.session.token = token;
              return resolve({
                success: true,
                message: 'login success',
                data: {
                  'token': token,
                  user: {
                    username: user.username
                  }
                }
              });
            }
          });
        } else {
          return reject({"message":"incorrect login"});

        }
      });//end find
    } else if (fromSocial == 'fb') {

    } else {
      return reject({
        "message": "not implemented yet."
      });
    }
  });
}
