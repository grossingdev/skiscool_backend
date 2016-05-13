import Client from '../../db/ClientsModel';
import Instructor from '../../db/InstructorsModel';
import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import config from '../../config';
import statusCodeMessage from '../statusCodeMessage';
import {findUser} from './common';
export default function login(req) {
  return new Promise((resolve, reject) => {
    let {password, fromSocial, email, userType} = req.body;
    if (fromSocial == 'default') {
      let error_msg = '';
      let statusCode = 0;

      if (!email) {
        statusCode = 1001;
      }

      if (!password) {
        statusCode = 1002;
      }

      if (!userType) {
        statusCode = 1006;
      }

      if (statusCode != 0) {
        // email address is absolutely necessary for user creation
        return reject({
          success: false,
          msg: statusCodeMessage[statusCode],
          statusCode,
        });
      }
      let dbModel = null;
      if (userType == 'player') {
        dbModel = Client;
      } else if (userType == 'instructor') {
        dbModel = Instructor;
      }
      findUser(dbModel, email).then((code, users) => {
        //db error
        if (code == 2000) {
          let statusCode = 1010;
          return reject({
            success: false,
            msg: statusCodeMessage[statusCode],
            statusCode,
          });
          //user found using email
        } else if (code == 2001) {
          let user = users[0];
          bcrypt.compare( password, user.password, (err, isMatch) => {
            //password is not matching
            if (err || !isMatch)  {
              console.log('error: ' + err );
              let statusCode = 1013;
              return reject({
                success: false,
                msg: statusCodeMessage[statusCode],
                statusCode,
              });
            }

            //login completed
            if (isMatch) {
              let token = jwt.sign({
                "id": user._id,
                "name": user.name,
                'type' : userType,
                'expire': new Date().getTime() + 3600000 * 24 //one day
              }, config.jwt.secret);
              req.session.token = token;
              return resolve({
                success: true,
                message: 'login success',
                data: {
                  'token': token,
                  user: {
                    name: user.name,
                    email: user.email
                  }
                }
              });
            }
          });
          //user not found
        } else if (code == 2002) {
          let statusCode = 1012;
          return reject({
            success: false,
            msg: statusCodeMessage[statusCode],
            statusCode,
          });
        }
      });
    } else if (fromSocial == 'fb') {

    } else {
      let statusCode = 1014;
      return reject({
        success: false,
        msg: statusCodeMessage[statusCode],
        statusCode,
      });
    }
  });
}
