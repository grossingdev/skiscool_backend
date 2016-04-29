'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _utils = require('../utils/utils');

var _model = require('../db/model');

var _model2 = _interopRequireDefault(_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var socket = function socket(server) {
  var socketServer = _socket2.default.listen(server);

  var devices = [];
  var deviceSockets = [];
  var adminSocket = null;
  var rooms = [];
  var mainRoom = 'deviceLocation';

  // Initiate socket to handle all connection
  socketServer.sockets.on('connection', function (socket) {
    var socketID = socket.id;
    var adminValue = false;
    socket.join(mainRoom);
    // Listen for register action
    console.info("connected", socketID);
    socket.on('registerDevice', function (data) {
      if (data.username == "admin_root_123") {
        console.info("admin user logged in", data);
        adminSocket = socket;
        _model2.default.find({}, function (err, data) {
          adminSocket.emit('show_devices', data);
        });

        adminValue = true;
      } else {
        console.info("device is registered:", data);
        _model2.default.findOne({ uuid: data.uuid }, function (err, device) {
          if (device == null) {
            var newDevice = new _model2.default({
              uuid: data.uuid,
              username: data.username,
              location: data.location
            });

            // Save device information to database
            newDevice.save(function (err) {
              console.log(err);

              if (err == null) {
                // Make this device online
                _model2.default.findOne({ uuid: data.uuid }, function (err, device) {
                  console.log('Device ' + device.uuid + ' is online');
                  devices.push({
                    "socketID": socketID,
                    "username": data.username,
                    "id": device.id,
                    location: data.location
                  });
                  deviceSockets[socketID] = socket;
                  socket.emit('register response', "");
                  if (adminSocket) {
                    adminSocket.emit('show_devices', devices);
                  }
                });
              }
            });
          } else {
            var query = {
              uuid: data.uuid
            };

            var updateData = {
              uuid: data.uuid,
              username: data.username,
              location: data.location
            };

            _model2.default.update(query, updateData, function (err, device) {
              console.log('Device updated ', data);
              devices.push({
                uuid: data.uuid,
                "socketID": socketID,
                "username": data.username,
                "id": device.id,
                location: data.location
              });

              deviceSockets[socketID] = socket;
              socket.emit('register response', "");
              if (adminSocket) {
                adminSocket.emit('show_devices', devices);
              }
            });
          }
        });
      }
    });

    // Listen for disconnect event
    socket.on('disconnect', function () {
      // Update device  online status
      console.info("disconnected");
      if (adminValue) {
        adminSocket = null;
      } else {
        (0, _utils.removeObject)(devices, socketID, "socketID");
      }

      // send notification about device is offline.
      if (adminSocket) {
        adminSocket.emit('show_devices', devices);
      }
    });
  });
}; /**
    * Created by baebae on 4/29/16.
    */


exports.default = socket;