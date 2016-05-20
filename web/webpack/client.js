import fs from 'fs';
import path from 'path';

var nodeExternals = require('webpack-node-externals');
import config from '../src/config_head';



/*
const externals = fs.readdirSync( 'node_modules' )
  .filter( file => !file.includes( '.bin' ))
  .concat( config.subDirectoryNodeModules )
  .map( name => ({[ name ]: `commonjs ${ name }` }))
  .reduce(( prev, curr ) => ({ ...prev, ...curr }));
*/
const externalss = config.development.scripts
  .filter( name =>name.import)
 .map( sc => {return {[sc.import]:sc.identifier}; }).reduce(( prev, curr ) => ({ ...prev, ...curr }));

export default {
 entry: path.resolve( __dirname, '../src/client'),
 //  context: path.resolve(__dirname, ".."),
   externals:externalss,


};


