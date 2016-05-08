/**
 * Created by baebae on 5/3/16.
 */
import socketIO from 'socket.io';
import {removeObject, findByKey} from '../utils/utils';
import DeviceModel from '../db/DeviceModel';
import checkAuth from '../actions/account/checkAuth';
import _ from 'lodash';

let adminSockets = [];
let onlineSockets = [];

const updateAdmin = (socket, data) => {
  socket.emit('show_devices', {
    devices: data,
    online: onlineSockets
  });
};

const updateAllAdmin = () => {
  DeviceModel.find({}, function(err, data) {
    _.forEach(adminSockets, (adminSocket) => {
      if (err) {
        adminSocket.socket.emit('error', err);
      } else {
        updateAdmin(adminSocket.socket, data)
      }
    });
  });
}

const registerDevice = (user, data, socket) => {
  if (data.username =="admin_root_123") {
    //if admin registered
    console.info("admin user logged in", data);

    //update admin sockets
    adminSockets.push({
      socket: socket,
      socketId: socket.id
    });

    //return current device information
    DeviceModel.find({}, function(err, data) {
      updateAdmin(socket, data);
    });
  } else {
    console.info("device is registered:", data);

    //check device is registered
    DeviceModel.findOne({ uuid: data.uuid }, function (err, device) {

      //if no devices from database
      if (device == null) {
        let newDevice = new DeviceModel({
          uuid: data.uuid,
          username: user.username,
          location: data.location
        });

        // Save device information to database
        newDevice.save(function (err) {
          console.log(err);

          if (err == null) {
            //check device is updated
            DeviceModel.findOne({ uuid: data.uuid }, function (err, device) {
              if (!err && device) {
                console.log('Device ' + device.uuid + ' is online');

                onlineSockets.push({
                  socketId: socket.id,
                  uuid: data.uuid
                });
                socket.emit('register response', "");
                updateAllAdmin();
              }
            });
          }
        })
      } else {
        //if device is already registered

        let query = {
          uuid: data.uuid
        }
        //update device username, location
        let updateData = {
          uuid: data.uuid,
          username: user.username,
          location: data.location,
        };
        DeviceModel.update(query, updateData, function(err, device) {
          if (!err && device) {
            console.log('Device updated ', device);
            onlineSockets.push({
              socketId: socket.id,
              uuid: device.uuid
            });
            socket.emit('register response', "");
            updateAllAdmin();
          }
        })
      }
    });
  }
};

const socket = (server) => {
  let socketServer = socketIO.listen(server);

  let mainRoom = 'skiscool_room';

  // Initiate socket to handle all connection
  socketServer.sockets.on('connection', function (socket) {
    let socketID = socket.id;
    socket.join(mainRoom);

    // Listen for register action
    console.info("connected", socketID);

    socket.on('registerDevice', function (data) {
      //check user is logged in.
      checkAuth(data.token, true)
        .then((user) => {
          registerDevice(user, data, socket);
        });
    });

    // Listen for disconnect event
    socket.on('disconnect', function () {
      // Update device  online status
      console.info("disconnected");

      //remove disconnected socket from online, admin sockets array;
      removeObject(onlineSockets, socketID, "socketId");
      removeObject(adminSockets, socketID, "socketId");
    });
  });
}

export default socket;