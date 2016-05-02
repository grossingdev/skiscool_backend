/**
 * Created by baebae on 4/29/16.
 */
import express from 'express';
import http from 'http';

const port = 3700;
let app = express();
let server = http.createServer(app);

import routes from './routes';
routes(app);

import socket from './socket';
// Pass express to socket.io
socket(server);
// Require public folder resources
app.use(express.static(__dirname + '/../public'));

server.listen(port);
console.log('Server started on port ' + port);