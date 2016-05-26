import Client from '../../db/ClientsModel';
import Instructor from '../../db/InstructorsModel';

import config from '../../config';
import jwt from 'jsonwebtoken';
import {findUser, createUserToken} from './common';
import checkFacebookToken from './checkFacebookToken';
import statusCodeMessage from '../statusCodeMessage';
import nodemailer from 'nodemailer';
import stringFormater from 'string-template';

const sendEmail = (toUser, token) => {
  return new Promise((resolve, reject) => {
    let html = require('../../template/verification');
    let url = 'http://localhost:3700/account/verify/' + token;

    let emailHTML = stringFormater(html, {
      appName: config.app_name,
      url: url
    });

    let smtpTransport = nodemailer.createTransport(config.mailer.options);
    let mailOptions = {
      to: toUser,
      from: config.mailer.from,
      subject: 'Email Verification',
      html: emailHTML
    };
    smtpTransport.sendMail(mailOptions, (err) => {
      if (!err) {
        resolve();
      } else {
        reject();
      }
    });
  });
};


export const createUser = (name, password, fromSocial, age, languages, gender, email, userType, resolve, reject, req) => {
  let dbModel = null;
  let flagVerified = true;

  if (fromSocial == 'default') {
    flagVerified = false;
  }
  if (userType == 'player') {
    dbModel = Client;
  } else if (userType == 'instructor') {
    dbModel = Instructor;
  }
  //check user is exist in database already
  findUser(dbModel, email).then((res) => {
    //db error
    if (res.status == 2000) {
      let statusCode = 1010;
      return reject({
        success: false,
        msg: statusCodeMessage[statusCode],
        statusCode,
      });
      //user found in database already before register
    } else if (res.status == 2001) {
      // if facebook register, return successfully
      if (fromSocial === 'fb') {
        let user = res.users[0];
        let token = createUserToken(user, userType);
        req.session.token = token;

        return resolve({
          success: true,
          msg: 'login success',
          data: {
            'token': token,
            user: {
              name: user.name,
              email: user.email,
              userType
            }
          }
        });
      }
      //if normal register, api error because user has been already registered.
      else {
        let statusCode = 1011;
        return reject({
          success: false,
          msg: statusCodeMessage[statusCode],
          statusCode,
        });
      }
      //user not found
    } else if (res.status == 2002) {
      //create new user using facebook profile/request parameter.
      let user = null;
      if (userType == 'player') {
        user = new Client();
      } else if (userType == 'instructor') {
        user = new Instructor();
      }
      user.name = name;
      user.password = password;
      user.email = email;
      user.gender = gender;
      user.age = age;
      user.age_range = 'J0';
      user.languages = languages;
      //if facebook signup, it will verified as default
      user.verified = flagVerified;

      if (user.age <= 30 && user.age_range > 20) {
        user.age_range = 'J1';
      }

      if (user.age < 40 && user.age_range > 30) {
        user.age_range = 'J2';
      }

      //save user information into database;
      user.save(function(err) {
        //database error during save user into database
        if (err) {
          let statusCode = 1010;
          return reject({
            success: false,
            msg: statusCodeMessage[statusCode],
            statusCode,
          });
        }

        //create token using user information, type
        let token = createUserToken(user, userType);

        if (!flagVerified) {
          //if normal email register case, create verification email for registered user
          sendEmail(email, token)
            .then(()=>{
              return resolve({
                success: true,
                msg: 'User added/created successfully. Please check your email for verification',
                statusCode: 0,
                data: {
                }
              });
            }, () => {
              let statusCode = 1023;
              return reject({
                success: false,
                msg: statusCodeMessage[statusCode],
                statusCode,
              });
            });
        } else {
          //if facebook signup, signup has been completed successfully.
          req.session.token = token;
          return resolve({
            success: true,
            msg: 'User added/created successfully',
            statusCode: 0,
            data: {
              'token': token,
              'user': {
                name, email, userType
              }
            }
          });
        }
      });
    }
  })
}

export default function signIn(req, params, res) {
  return new Promise((resolve, reject) => {
    let {fromSocial, userType} = req.body;
    let dbModel = null;
    if (userType == 'player') {
      dbModel = Client;
    } else if (userType == 'instructor') {
      dbModel = Instructor;
    }

    //facebook signup
    if (fromSocial === 'fb') {
      //check facebook token is exist
      if (!req.body.access_token) {
        let statusCode = 1007;
        return reject({
          success: false,
          msg: statusCodeMessage[statusCode],
          statusCode,
        });
      } else {
        //check facebook token is valid...
        checkFacebookToken(req).then((profile) => {
          let name = profile.displayName;
          let gender = profile.gender;
          if (!gender || gender.length == 0) {
            gender = 'Man';
          }

          let image = profile.photos[0].value;
          let email = profile.emails[0].value;
          let languages = '';
          let age = 0;
          let password = new Date();

          console.info('facebook', profile);

          //create user from facebook profile
          createUser(name, password, fromSocial, age, languages, gender, email, userType, (param)=>{
            resolve(param);

            let updateData = {
              image: image,
            };

            //update user avatar image from facebook profile
            dbModel.update({email: email}, updateData, function(err, user) {
              if (err) {
                console.info("err update user image",  err);
              }
              if (!err && user) {
                console.info("user image updated");
              }
            });
          }, reject, req);
        });
      }
    }
    //normal sign up
    else if (fromSocial == 'default') {
      let {name, password, age, languages, gender, email} = req.body;
      let statusCode = 0;
      //check 'name', 'email', 'password', 'age', 'gender', 'languages', 'gender' is exist in request
      if (!name) {
        statusCode = 1000;
      }

      if (!email) {
        statusCode = 1001;
      }

      if (!password || password.length == 0) {
        statusCode = 1002;
      }

      if (!age) {
        statusCode = 1003;
      } else {
        age = parseInt(age);
        if (isNaN(age)) {
          statusCode = 1003;
        }
      }

      if (!languages) {
        statusCode = 1004;
      }

      if (!gender) {
        statusCode = 1005;
      }

      if (!userType) {
        statusCode = 1006;
      }

      //if request parameter is not enough return api error.
      if (statusCode != 0) {
        // email address is absolutely necessary for user creation
        return reject({
          success: false,
          msg: statusCodeMessage[statusCode],
          statusCode,
        });
      }
      //create user using request parameters
      createUser(name, password, fromSocial, age, languages, gender, email, userType, resolve, reject, req);
    }
  });
}
