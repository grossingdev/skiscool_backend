/**
 * Created by baebae on 4/29/16.
 */
import express from 'express';
import session from 'express-session';
import http from 'http';
import bodyParser from 'body-parser';
import * as actions from './actions/index';
import {mapUrl} from 'utils/url.js';

const port = 3700;
let app = express();
let server = http.createServer(app);
//app.use(session({
//  secret: 'react and redux rule!!!!',
//  resave: false,
//  saveUninitialized: false,
//  cookie: { maxAge: 0 }
//}));
app.use(bodyParser.json());

app.use((req, res) => {
  const splittedUrlPath = req.url.split('?')[0].split('/').slice(1);

  const {action, params} = mapUrl(actions, splittedUrlPath);

  if (action) {
    action(req, params)
      .then((result) => {
        if (result instanceof Function) {
          result(res);
        } else {
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