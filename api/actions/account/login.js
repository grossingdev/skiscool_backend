import UserModel from '../../db/ClientsModel';
import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import config from '../../config';

export default function login(req) {
  return new Promise((resolve, reject) => {
    let {username, password, fromSocial, email, userType} = req.body;
    if (fromSocial == 'default') {
      let error_msg = '';
      let statusCode = 0;
      if (!username) {
        error_msg = 'User name is required.';
        statusCode = 1000;
      }

      if (!email) {
        error_msg = 'User Email is required.';
        statusCode = 1001;
      }

      if (!password) {
        error_msg = 'User password is required.';
        statusCode = 1002;
      }

      if (!age) {
        error_msg = 'User age is required.';
        statusCode = 1003;
      }

      if (!languages) {
        error_msg = 'Language is required.';
        statusCode = 1004;
      }

      if (!gender) {
        error_msg = 'Gender is required.';
        statusCode = 1005;
      }

      if (!userType) {
        error_msg = 'User type is required.';
        statusCode = 1006;
      }

      if (statusCode != 0) {
        // email address is absolutely necessary for user creation
        return reject({
          success: false,
          error_msg,
          statusCode,
        });
      }

      UserModel.findOne({email}, (err, user) => {
        if (err) {
          return reject({
            success: false,
            message: 'Mongodb error occured while checking if the user exists',
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
