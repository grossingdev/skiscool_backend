/**
 * Created by BaeBae on 5/12/16.
 */

/*
 find user using email

 2000: mongodb error,
 2001: user found, return user list,
 2002: user not found, return null
 */
import config from '../../config';
import jwt from 'jsonwebtoken';

export const findUser = (UserModel, email) => {
  return new Promise((resolve, reject) => {
    UserModel.find({email}, (err, foundUsers) => {
      if (err) {
        return resolve({
          status: 2000
        });
      }
      if (foundUsers && foundUsers.length > 0) {
        console.log('founder user: '+ foundUsers);
        // if users are found, we cannot create the user
        // send an appropriate response back
        return resolve({
          status: 2001,
          users: foundUsers
        });
      } else {
        return resolve({
          status: 2002
        });
      }
    });
  });
};

export const createUserToken = (user, userType) => {
  let token = jwt.sign({
    'name': user.name,
    'email': user.email,
    'userType' : userType,
    'expire': new Date().getTime() + 3600000 * 24 //one day
  }, config.jwt.secret);
  return token;
};
