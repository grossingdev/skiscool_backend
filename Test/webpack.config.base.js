var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var postcssImport = require('postcss-import');
var precss = require('precss');
var styleVars = require('./globalStyleVars');

module.exports = function(options) {

  return {
    devtool: 'source-map',
    entry: [
      './index.js',
    ],
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'bundle.js',
      publicPath: '/dist/',
    },
    resolve: {
      modulesDirectories: [
        'node_modules',
        'components',
        'lib',
        'actions',
        'selectors',
      ],
    },
    plugins: [
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify(options.env),
        },
      }),
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false,
        },
      }),
      (options.env !== 'development' && new ExtractTextPlugin('styles.css')),
    ],
    module: {
      loaders: [
        { test: /\.css$/,
          loader: options.env !== 'development' ?
            ExtractTextPlugin.extract('style', 'css?importLoaders=1!postcss') :
            'style!css?importLoaders=1!postcss',
        },
        {test: /\.json$/, loader: 'json'},
        {test: /\.jsx?$/,
          exclude: /node_modules/,
          loaders: ['babel'],
        },
      ],
    },
    postcss: (webpackInst) => {
      return [
        postcssImport({
          addDependencyTo: webpackInst,
        }),
        precss({
          variables: { variables: styleVars },
        }),
      ];
    },
  };
}