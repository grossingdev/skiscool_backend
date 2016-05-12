/**
 * Created by BaeBae on 5/6/16.
 */
import UserModel from '../../db/ClientsModel';
import jwt from 'jsonwebtoken';
import config from '../../config'; // get our config file

//check token from api, socket request.
export default (req, flagToken) => {
  console.info('req', req);
  return new Promise((resolve, reject) => {

    let token = "";
    if (flagToken) {
      token = req;
    } else {
      //get token from cookie, session or api request body parameters, url query parameters, from headers.
      token = req.cookies['accessToken'] || req.body.token || req.query.token || req.headers['x-access-token'] ||req.session.token;
    }

    if (token && token.length > 0) {
      //if token found, verify it against the secret
      console.log('token :' + token);

      jwt.verify(token, config.jwt.secret, (err, decodedToken) =>{
        if (err) {
          // verification failed
          reject();
          return;
        }

        //check expire date too
        let currentDate = new Date().getTime();
        if (!decodedToken.expire || parseInt(decodedToken.expire) < currentDate) {
          reject();
          return;
        }

        // verification passed, put the decodedToken onto request object (req)
        UserModel.findOne({
          $or: [{
            username: decodedToken.username
          }, {
            email: decodedToken.email
          }]
        }, function(err, foundUser) {
          if (err) {
            //database search error
            reject();
            return;
          }
          if (foundUser) {
            //success
            resolve(foundUser, decodedToken);
            return;
          } else {
            //no such user from database.
            reject();
            return;
          }
        });
      });
    } else {
      //no token found
      reject();
      return;
    }
  });
}