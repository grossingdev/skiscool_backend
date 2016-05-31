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
  let sqlite3 = require('sqlite3').verbose();
  let db = new sqlite3.Database(fileName);
  let zlib = require('zlib');

  db.serialize(function() {
    db.each("select * from tiles", function(err, row) {
      let tilePath = './web/static/tiles/' + row.z + '/' + row.x ;

      mkdirp(tilePath, (err) => {
        let fileName = tilePath + '/' + row.y + '.png';
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
  // parseMapBoxOfflinePackage('d6523435-36ab-1912-8172-1d8bd41b3f5b.db');
  return new Promise((resolve, reject) => {
    checkAuth(req).then((user) => {
      if (user.userType == 'instructor' && user.flagAdmin == true) {
        let boundary = new Boundary();
        boundary.boundary = req.body.bounds;
        boundary.base64Data = req.body.base64Data;
        boundary.name = req.body.name;
        boundary.fileName = boundary.name  + '.db';

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