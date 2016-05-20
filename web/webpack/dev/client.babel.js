
import webpack from 'webpack';


import clientConfig from '../client';
import devConfig from '../dev';
import WebpackIsomorphicToolsPlugin from 'webpack-isomorphic-tools/plugin';
var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('../webpack-isomorphic-tools'));


const baseConfig = {
  ...clientConfig,
  ...devConfig,
};
export default {
  // devtool: 'eval',
  ...baseConfig,
   devtool: 'cheap-module-eval-source-map',
  entry: [
   'webpack-dev-server/client?http://localhost:8082/',
    'webpack/hot/only-dev-server',
    'react-hot-loader/patch',
    baseConfig.entry,
  ],
  resolve: {
		 modulesDirectories: [
			"src",
			"node_modules"
		],
		extensions: ['', '.json', '.js', '.jsx']
	},
  //externals:externalss,
  output: {
    ...baseConfig.output,
    filename: 'client.js'
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
   new webpack.HotModuleReplacementPlugin(),
    webpackIsomorphicToolsPlugin.development(),
  ]
};
