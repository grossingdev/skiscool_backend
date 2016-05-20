import webpack from 'webpack';


import clientConfig from '../client';
import proConfig from '../pro';

const baseConfig = {
  ...clientConfig,
  ...proConfig,
};

export default {
...baseConfig,
  output: {
    ...baseConfig.output,
    filename: 'client.min.js',
  },
  resolve: {
		 modulesDirectories: [
			"src",
			"node_modules"
		],
		extensions: ['', '.json', '.js', '.jsx']
	},
	plugins: [
new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify( 'production' ),
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: false,
      __DEVTOOLS__: false  // <-------- DISABLE redux-devtools HERE
    }),
    ...baseConfig.plugins
  ],
};
