import webpack from 'webpack';

import proConfig from '../pro';
import serverConfig from '../server';

const baseConfig = {
  ...serverConfig,
  ...proConfig,
};

export default {
  ...baseConfig.default,
  devtool: 'eval',
  postcss: {
	...baseConfig.postcss,
	},
  output: {
    ...baseConfig.output,
    libraryTarget: 'commonjs2',
    filename: 'server.min.js',
  },
resolve: {
		 modulesDirectories: [
			"src",
			"node_modules"
		],
		extensions: ['', '.json', '.js', '.jsx']
	},plugins: [
new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify( 'production' ),
      __CLIENT__: false,
      __SERVER__: true,
      __DEVELOPMENT__: false,
      __DEVTOOLS__: false  // <-------- DISABLE redux-devtools HERE
    }),
    ...baseConfig.plugins
  ],
};
