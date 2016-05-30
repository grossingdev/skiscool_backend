/**
 * Created by BaeBae on 5/30/16.
 */
import fs from 'fs';

export const writeFile = (fileName, content, type)=> {
  return new Promise((resolve, reject) => {
    if (type == 'base64') {
      fs.writeFile(fileName, new Buffer(content, "base64"), (err) => {
        if (err) {
          console.info('err', err);
          reject()
        } else {
          resolve(fileName);
        }
      });
    } else if (type == 'binary') {
      fs.writeFile(fileName, content,  "binary", (err) => {
        if (err) {
          console.info('err', err);
          reject()
        } else {
          resolve(fileName);
        }
      });
    }
  })
};

export const readFile = (fileName)=> {
  var readStream = fs.createReadStream(fileName);
  var zlib = require('zlib');
  readStream.on('data', function (chunk) {
    console.log(chunk.length);
    zlib.unzip(chunk, (err, buffer) => {
      if (!err) {
        console.log(buffer.toString());
        fs.writeFile("test.result", buffer,  "binary",function(err) {
          if(err) {
            console.log(err);
          } else {
            console.log("The file was saved!");
          }
        });
      } else {
        // handle error
      }
    });
  })
};

