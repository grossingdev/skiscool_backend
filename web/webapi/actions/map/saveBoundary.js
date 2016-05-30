/**
 * Created by BaeBae on 5/19/16.
 */
import checkAuth from '../account/checkAuth';
import statusCodeMessage from '../statusCodeMessage';
import Boundary from '../../db/BoundaryModel';
import generateUUID from '../../utils/uuid';
import {writeFile} from '../../utils/fileUtils';

export default function saveBoundary(req) {
  return new Promise((resolve, reject) => {
    checkAuth(req).then((user) => {
      if (user.userType == 'instructor' && user.flagAdmin == true) {
        let boundary = new Boundary();
        let uuid = generateUUID();
        boundary.boundary = req.body.bounds;
        boundary.fileName = uuid + '.db';
        boundary.base64Data = req.body.base64Data;
        writeFile(boundary.fileName, boundary.base64Data);

        console.info('start save', req.body.boundary);
        boundary.save(function(err) {
          console.info('end save');
          if (err) {
            console.info('save error', err);
            let statusCode = 1024;
            return reject({
              success: false,
              msg: statusCodeMessage[statusCode],
              statusCode,
            });
          }

          return resolve({
            success: true,
            statusCode: 0,
            msg: 'Save boundary successfully',
          });
        });
      } else {
        let statusCode = 1022;
        return reject({
          success: false,
          msg: statusCodeMessage[statusCode],
          statusCode,
        });
      }

    }, () => {
      let statusCode = 1015;
      return reject({
        success: false,
        msg: statusCodeMessage[statusCode],
        statusCode,
      });
    })
  });
}