import atImport from 'postcss-import';
import autoprefixer from 'autoprefixer';
import calcFunction from 'postcss-calc-function';
import colorFunction from 'postcss-color-function';
import customProps from 'postcss-custom-props';
import path from 'path';

import config from '../src/config_head';

export default {
  output: {
    path: path.resolve( __dirname, '../'+config.dir.dist ),
    publicPath: 'http://localhost:8082/dist/',
  },
  postcss: function ( webpack ) {
    return [
      atImport({ addDependencyTo: webpack }),
      customProps(),
      calcFunction(),
      colorFunction(),
      autoprefixer({ browsers: [ 'last 2 versions' ]}),
    ];
  }

};
