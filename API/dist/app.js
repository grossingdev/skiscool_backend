'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _socket = require('./socket');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by baebae on 4/29/16.
 */


var port = 3700;
var app = (0, _express2.default)();
var server = _http2.default.createServer(app);

(0, _routes2.default)(app);

// Pass express to socket.io
(0, _socket2.default)(server);
// Require public folder resources
app.use(_express2.default.static(__dirname + '/../public'));

server.listen(port);
console.log('Server started on port ' + port);