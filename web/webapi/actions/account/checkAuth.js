/**
 * Created by BaeBae on 5/6/16.
 */
import Client from '../../db/ClientsModel';
import Instructor from '../../db/InstructorsModel';
import jwt from 'jsonwebtoken';
import config from '../../config'; // get our config file
import {findUser} from './common';
//check token from api, socket request.
export default (req, flagToken) => {
  return new Promise((resolve, reject) => {

    let token = "";
    if (flagToken) {
      token = req;
    } else {
      //get token from cookie, session or api request body parameters, url query parameters, from headers.
      token = req.body.token || req.query.token || req.headers['x-access-token'] ||req.session.token;
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
        let userType = decodedToken.userType;
        let dbModel = Client;
        if (userType == 'instructor') {
          dbModel = Instructor;
        }
        findUser(dbModel, decodedToken.email).then((res) => {
          if (res.status == 2001) {
            return resolve(res.users[0], decodedToken);
          } else {
            return reject();
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