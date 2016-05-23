/**
 * Created by baebae on 4/29/16.
 */
import express from 'express';
import session from 'express-session';
import http from 'http';
import bodyParser from 'body-parser';
import * as actions from './actions/index';
import {mapUrl} from './utils/url.js';
import PrettyError from 'pretty-error';

const pretty = new PrettyError();

const port = 3700;
let app = express();
let server = http.createServer(app);

let allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
}

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(session({
  secret: 'skiscool',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 0 }
}));
app.use(allowCrossDomain);

app.use((req, res) => {
  const splittedUrlPath = req.url.split('?')[0].split('/').slice(1);

  const {action, params} = mapUrl(actions, splittedUrlPath);

  //allow Cross domains
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else if (action && (req.method === 'POST') || req.method === 'GET') {
    action(req, params, res)
      .then((result) => {
        if (result instanceof Function) {
          result(res);
        } else {
          // console.info("api result:" + req.url, result);
          res.json(result);
        }
      }, (reason) => {
        if (reason && reason.redirect) {
          res.redirect(reason.redirect);
        } else {
          console.error('API ERROR:', pretty.render(reason));
          res.status(reason.status || 500).json(reason);
        }
      });
  } else {
    res.status(404).end('NOT FOUND');
  }
});


import socket from './socket';
// Pass express to socket.io
socket(server);
// Require public folder resources
app.use(express.static(__dirname + '/../public'));

server.listen(port);
console.log('Server started on port ' + port);