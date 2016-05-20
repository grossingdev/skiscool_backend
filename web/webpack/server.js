import fs from 'fs';
import path from 'path';

//import config from '../src/config_head';
var nodeExternals = require('webpack-node-externals');

/*const externals = fs.readdirSync( 'node_modules' )
  .filter( file => !file.includes( '.bin' ))
   .concat( config.subDirectoryNodeModules )
  .map( name => ({[ name ]: `commonjs ${ name }` }))
  .reduce(( prev, curr ) => ({ ...prev, ...curr }));

console.log(externals);*/
export default {
  entry: './src/server',
  externals:[function filter(context, request, cb) {
      const isExternal =
        request.match(/^[a-z][a-z\/\.\-0-9]*$/i) &&
        !request.match(/^react-routing/) &&
        !request.match(/^react-dom/) &&
        !request.match(/^react-redux/) &&
        !request.match(/^redux/) &&
        !context.match(/[\\/]react-routing/);
      cb(null, Boolean(isExternal));
    }],
/*  externals: [nodeExternals({
  //on defini tou ce  qui est dan sle  bundle
whitelist:[/^redux/,/^react/,/^postcss/,/^style/,/^react-dom/,/^react-redux/,/^webpack/,/babel/]
    })],*/
   node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },
  target: 'node',
};
