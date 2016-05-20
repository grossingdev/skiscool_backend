import webpack from 'webpack';
import WebpackIsomorphicToolsPlugin from 'webpack-isomorphic-tools/plugin';
var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('../webpack-isomorphic-tools'));

import devConfig from '../dev';
import serverConfig from '../server';

const baseConfig = {
  ...serverConfig,
  ...devConfig,
};
export default {
  ...baseConfig,
  devtool: 'source-map',
  resolve: {
	 modulesDirectories: [
			"src" , "node_modules"
		],
		extensions: ['', '.json', '.js', '.jsx']
	},
  output: {
    ...baseConfig.output,
    libraryTarget: 'commonjs2',
    filename: 'server.js',
  },
  plugins: [
new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify( 'development' ),
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true,
      __DEVTOOLS__: false  // <-------- DISABLE redux-devtools HERE
    }),
    ...baseConfig.plugins,
    webpackIsomorphicToolsPlugin.development(),
  ],
};

