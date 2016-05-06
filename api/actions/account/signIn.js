import UserModel from '../../db/UserModel';
import config from '../../config';
import jwt from 'jsonwebtoken';

export default function signIn(req) {
  return new Promise((resolve, reject) => {
    let {username, password, fromSocial, email} = req.body;
    if (!username) {
      // email address is absolutely necessary for user creation
      return reject({
        success: false,
        message: 'username required',
        data: {}
      });
      return;
    }

    if (fromSocial === 'default' && !password) {
      return reject({
        success: false,
        message: 'password required',
        data: {}
      });
      return;
    }

    if (fromSocial === 'default' && !email) {
      return reject({
        success: false,
        message: 'email required',
        data: {}
      });
      return;
    }

    if (fromSocial === 'fb') {
      if (!req.body.fbId) {
        return reject({
          success: false,
          message: 'Facebook token id is required',
          data: {}
        });
        return;
      } else {
        UserModel.find({username}, (err, foundUsers) => {
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
          if (foundUsers && foundUsers.length > 0) {
            console.log('founder user', foundUsers);
            // if they do, send an appropriate response back
            reject({
              success: false,
              message: 'User with requested username with facebook has been already exists',
              data: {}
            });
            return;
          } else {
            let generatedUserName = email.split('@')[0] + Math.floor(Math.random() * 10000);
            let generatedPassword = Math.floor(Math.random() * 1000) + '' + Math.floor(Math.random() * 1000);
            let user = new UserModel();
            user.username = generatedUserName;
            user.email = email;
            user.password = generatedPassword;

            //facebook
            user.facebook.id = req.body.fbId;
            user.fullname = req.body.fbFullName;
            user.profile_pic = 'https://graph.facebook.com/' + req.body.fbId + '/picture?type=large';

            user.save((err) => {
              if (err) {
                reject({
                  success: false,
                  message: 'Error occured while saving the user',
                  data: {
                    'error': err
                  }
                });
                return;
              }

              let payload = {
                'username': user.username,
                'email': user.email
              };
              let token = jwt.sign(payload, config.jwt.secret, {
                expiresInMinutes: 14400
              });
              req.session.token = token;
              resolve({
                success: true,
                message: 'User added/created successfully',
                data: {
                  'token_for': user.username,
                  'token': token
                }
              });
            });
          }
        });
      }
    } else if (fromSocial == 'default') {
      UserModel.find({
        $or: [{'username': username}, {'email': email}]
      }, (err, foundUsers) => {
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

        if (foundUsers && foundUsers.length > 0) {
          console.log('founder user: '+ foundUsers);
          // if users are found, we cannot create the user
          // send an appropriate response back
          reject({
            success: false,
            message: 'User with requested username and/or email already exists',
            data: {}
          });
          return;
        } else {
          // create the user with specified data
          let user = new User();
          user.username = username;
          user.password = password;
          user.email = email || ' ';
          user.save(function(err) {
            if (err) {
              reject({
                success: false,
                message: 'Error occured while saving the user',
                data: {
                  'error': err
                }
              });
              return;
            }
            let payload = {
              'username': user.username,
              'email': user.email
            };
            var token = jwt.sign(payload, config.jwt.secret, {
              expiresInMinutes: 14400*360
            });
            req.session.token = token;
            
            resolve({
              success: true,
              message: 'User added/created successfully',
              data: {
                'token_for': user.username,
                'token': token
              }
            });
            return;
          });
        }
      });
    }
  });
}
