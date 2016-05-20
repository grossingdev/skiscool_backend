import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import defaultConfig from './default';
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));
import strip from 'strip-loader';

export default {
  ...defaultConfig,
   module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loaders: [strip.loader('debug'), 'babel']},
      { test: /\.json$/, loader: 'json-loader' },
 {
        test: /(\.scss|\.css)$/, include: /Html/,
        loader: 'style-loader!css?module&importLoaders=2&localIdentName=[name]__[local]___[hash:base64:5]!sass!postcss?sourceMap',
      },
      { test: /(\.scss|\.css)$/,exclude: /Html/,
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass!postcss?sourceMap')},
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" },
//{ test:   /\.css$/, loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap=true&sourceMapContents=true' }
  { test: webpackIsomorphicToolsPlugin.regular_expression('images'), loader: 'url-loader?limit=10240' }

    ]
    },
  plugins: [
     new webpack.IgnorePlugin(/webpack-stats\.json$/,/react-dom/,/^react$/,/^redux$/,/^react-redux$/),
    new ExtractTextPlugin( 'styles.min.css' ),
    // optimizations
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      output: {
        comments: true,
      },
    })
  ],
};
