require ('react-hot-loader/patch');

import config from './config';
import Express from 'express';
import React from 'react';
import { render } from 'react-dom';
import ReactDOM from 'react-dom/server';
import favicon from 'serve-favicon';
import compression from 'compression';
import httpProxy from 'http-proxy';
import path from 'path';
import createStore from './redux/create';
import ApiClient from './helpers/ApiClient';
import Html from './helpers/Html';
import PrettyError from 'pretty-error';
import http from 'http';

import { match } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { ReduxAsyncConnect, loadOnServer } from 'redux-async-connect';
import createHistory from 'react-router/lib/createMemoryHistory';
import {Provider} from 'react-redux';
import getRoutes from './routes';
import Root from './containers/Root.dev';
import config_head from './config_head';

/*** init hotload ***/
var webpack = require('webpack');
var webpackConfig = require('../webpack/dev.config');
var WebpackDevServer = require('webpack-dev-server');
var compiler = webpack(webpackConfig);
var host = config.host || 'localhost';
var port = (Number(config.port) + 2) || 8082; //8081 is using for react-native debug

  // First we fire up Webpack an pass in the configuration we
  // created
  var bundleStart = null;
  // We give notice in the terminal when it starts bundling and
  // set the time it started
  compiler.plugin('compile', function() {

    console.log('Bundling...');
    bundleStart = Date.now();
  });

  // We also give notice when it is done compiling, including the
  // time it took.
  compiler.plugin('done', function() {
    console.log('Bundled in ' + (Date.now() - bundleStart) + 'ms!');
  });
  var bundler = new WebpackDevServer(compiler, {
    hot:true,
    headers: { 'Access-Control-Allow-Origin': '*' },
  historyApiFallback: true,
  contentBase: 'http://localhost:' + port,
  publicPath: webpackConfig.output.publicPath,
    quiet: true,
    lazy: false,
    noInfo: false,
    stats: {
      colors: true
    }
  });
  // We fire up the development server and give notice in the terminal
  // that we are starting the initial bundle
  bundler.listen(port, 'localhost',  function onAppListening(err) {
  if (err) {
    console.error(err);
  } else {
    console.info('==> 🚧  Webpack development server listening on port %s', port);
  }


/*** init hotload ***/


const scripts = config_head[ __DEVELOPMENT__ ? 'development' : 'production' ].scripts
  .map( script => `/${((script.file.indexOf("http") > -1)?script.file:""+config_head.dir.js+"/"+script.file.split( '/' ).pop()) }` );

const styles = config_head[ __DEVELOPMENT__ ? 'development' : 'production' ].styles
  .map( style => `${((style.indexOf("http") > -1)?style:""+config_head.dir.css+"/"+style.split( '/' ).pop()) }` );

console.log(styles);

const targetUrl = 'http://' + config.apiHost + ':' + config.apiPort;
const pretty = new PrettyError();
const app = new Express();
const server = new http.Server(app);

app.use(compression());
app.use(favicon(path.join(__dirname, '..', 'static', 'favicon.ico')));

app.use(Express.static(path.join(__dirname, '..', 'static')));


const proxy = httpProxy.createProxyServer({
  target: targetUrl,
  ws: true
});

// Proxy to API server

server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head);
});


app.use((req, res) => {
  if (__DEVELOPMENT__) {
    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
   // webpackIsomorphicTools.refresh();
  }
  const client = new ApiClient(req);
  const memoryHistory = createHistory(req.originalUrl);
  const store = createStore(memoryHistory, client);
  const history = syncHistoryWithStore(memoryHistory, store);

  function hydrateOnClient() {
    res.send('<!doctype html>\n' +
      ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} store={store} scripts={ scripts }
        styles={ styles } />));
  }

  if (__DISABLE_SSR__) {
    hydrateOnClient();
    return;
  }

  match({ history, routes: getRoutes(store), location: req.originalUrl }, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      res.redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (error) {
      console.error('ROUTER ERROR:', pretty.render(error));
      res.status(500);
      hydrateOnClient();
    } else if (renderProps) {
      loadOnServer({...renderProps, store, helpers: {client}}).then(() => {
        const component = (
          <Provider store={store} key="provider">
            <ReduxAsyncConnect {...renderProps} />
          </Provider>
        );

        res.status(200);

        global.navigator = {userAgent: req.headers['user-agent']};

        res.send('<!doctype html>\n' +
          ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} component={component} store={store}  scripts={ scripts }
        styles={ styles } />));
      });
    } else {
      res.status(404).send('Not found');
    }
  });
});

app.use('/api', (req, res) => {
  proxy.web(req, res, {target: targetUrl});
});

app.use('/ws', (req, res) => {
  proxy.web(req, res, {target: targetUrl + '/ws'});
});

// added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
proxy.on('error', (error, req, res) => {
  let json;
  if (error.code !== 'ECONNRESET') {
    console.error('proxy error', error);
  }
  if (!res.headersSent) {
    res.writeHead(500, {'content-type': 'application/json'});
  }

  json = {error: 'proxy_error', reason: error.message};
  res.end(JSON.stringify(json));
});


if (config.port) {
  server.listen(config.port, (err) => {
    if (err) {
      console.error(err);
    } else {
    console.info('----\n==> ✅  %s is running, talking to API server on %s.', config.app.title, config.apiPort);
    console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.host, config.port);
    }
  });
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}



  });
