/**
 * Created by BaeBae on 5/30/16.
 */
import fs from 'fs';

export const writeFile = (fileName, base64Content)=> {
  fs.writeFile(fileName, new Buffer(base64Content, "base64"), (err) => {
    console.info('err', err);
  });
};

export const readFile = (fileName)=> {

};

