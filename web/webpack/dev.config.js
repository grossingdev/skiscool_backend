require('../server.babel');
require('babel-polyfill');

// Webpack config for development
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var assetsPath = path.resolve(__dirname, '../static/dist');
var host = (process.env.HOST || 'localhost');
var port = (+process.env.PORT + 2) || 8082; //8081 is using for react-native debugger;

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));

module.exports = {

   //devtool: 'source-map',
    //devtool: 'inline-source-map',
    devtool:'eval',
   //devtool: 'cheap-module-eval-source-map',
   context: path.resolve(__dirname, ".."),
  entry:[
  'react-hot-loader/patch',
    'webpack-dev-server/client?http://' + host + ':' + port + '',
    'webpack/hot/only-dev-server',
     //'!style!css!sass!./src/theme/bootstrap.config.scss',
    'font-awesome-webpack!./src/theme/font-awesome.config.js',
     path.resolve(__dirname, '../src/client.js')
     ]
 ,
  output: {
    path: assetsPath,
    filename: 'bundle.js',
    /*filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',*/
    publicPath: 'http://' + host + ':' + port + '/dist/'
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel']},
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.less$/, loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 version!less?outputStyle=expanded&sourceMap=true&sourceMapContents=true' },
      { test: /\.scss$/, loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap=true&sourceMapContents=true' },
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" },

      { test: webpackIsomorphicToolsPlugin.regular_expression('images'), loader: 'url-loader?limit=10240' }
    ]
  },
  /*sassLoader: {
    includePaths: [path.resolve(__dirname, '..', "src")]
  },*/
  noInfo: true,
  quiet: true,
  progress: false,
  resolve: {
     root: [path.join(__dirname, '..', 'src'),path.join(__dirname, '..', 'node_modules')],

    extensions: ['', '.json', '.js', '.jsx']
  },
  plugins: [
    // hot reload
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(/webpack-stats\.json$/),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true,
      __DEVTOOLS__: true  // <-------- DISABLE redux-devtools HERE
    }),
    new webpack.NoErrorsPlugin(),
 webpackIsomorphicToolsPlugin.development(),
 //debuging
 /*
 function()
    {
        this.plugin("done", function(stats)
        {
          console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
          console.log(
            JSON.stringify(
              stats.toJson(
                {
                  context: path.resolve(__dirname)
                }
            ),
            null, 2)
          )
          console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<')
        })
    }*/
  ]
};
