/**
 * Created by BaeBae on 5/19/16.
 */
import checkAuth from '../account/checkAuth';
import statusCodeMessage from '../statusCodeMessage';
import Boundary from '../../db/BoundaryModel';
import Tiles from '../../db/TilesModel';

import generateUUID from '../../utils/uuid';
import {writeFile, readFile} from '../../utils/fileUtils';
import mkdirp from 'mkdirp';

const saveTileInformation = (rowInfo) => {
  let tile = new Tiles();
  tile.x = rowInfo.x;
  tile.y = rowInfo.y;
  tile.z = rowInfo.z;
  tile.url_template = rowInfo.url_template;
  tile.id = rowInfo.id;

  tile.save((err) => {

  });
}

const parseMapBoxOfflinePackage = (fileName) => {
  var sqlite3 = require('sqlite3').verbose();
  let db = new sqlite3.Database(fileName);
  var zlib = require('zlib');

  db.serialize(function() {
    db.each("select * from tiles as T where T.z > 14 and T.z < 18", function(err, row) {
      let tilePath = './web/static/tiles/' + row.z + '/' + row.x + '/' + row.y ;

      mkdirp(tilePath, (err) => {
        let fileName = tilePath + '/' + row.x + '-' + row.y + '.png';
        if (err) {
          console.error(err)
        } else {
          zlib.unzip(row.data, (err, buffer) => {
            if (!err) {
              writeFile(fileName, buffer, 'binary');
              saveTileInformation(row);
            }
          });
        }
      });
    });
  });
  db.close();
}
export default function saveBoundary(req) {
  // parseMapBoxOfflinePackage('b61c3d86-9d5c-4773-bf51-c1b2cffb8c21.db');
  return new Promise((resolve, reject) => {
    checkAuth(req).then((user) => {
      if (user.userType == 'instructor' && user.flagAdmin == true) {
        let boundary = new Boundary();
        let uuid = generateUUID();
        boundary.boundary = req.body.bounds;
        boundary.fileName = uuid + '.db';
        boundary.base64Data = req.body.base64Data;
        writeFile(boundary.fileName, boundary.base64Data, 'base64')
          .then((fileName)=>{
            parseMapBoxOfflinePackage(fileName);
          });

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