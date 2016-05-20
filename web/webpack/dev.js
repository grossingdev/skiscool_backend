import webpack from 'webpack';

import ExtractTextPlugin from 'extract-text-webpack-plugin';
import defaultConfig from './default';
export default {
  ...defaultConfig,
 module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader:'babel', query: {compact: true}},
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" },
 {
        test: /(\.scss|\.css)$/, include: /Html/,
        loader: 'style-loader!css?module&importLoaders=2&localIdentName=[name]__[local]___[hash:base64:5]!sass!postcss?sourceMap',
      },
   //   { test: /\.less$/, loader: 'style-loader!css-loader?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!ess?outputStyle=expanded&sourceMap=false' },
      { test: /(\.scss|\.css)$/,exclude: /Html/,
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass!postcss?sourceMap')},
   ]
    },
      plugins: [
      new ExtractTextPlugin('styles.css' ),
     new webpack.IgnorePlugin(/webpack-stats\.json$/,/react-dom/,/^react$/,/^redux$/,/^react-redux$/)
  ],
};
