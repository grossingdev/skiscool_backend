/**
 * Created by baebae on 4/29/16.
 */
import socketIO from 'socket.io';
import {removeObject, findByKey} from '../utils/utils';
import DeviceModel from '../db/model';

let adminSocket = null;

const socket = (server) => {
  let socketServer = socketIO.listen(server);

  let devices = [];
  let deviceSockets = [];
  let rooms = [];
  let mainRoom = 'deviceLocation';

// Initiate socket to handle all connection
  socketServer.sockets.on('connection', function (socket) {
    let socketID = socket.id;
    let adminValue = false;
    socket.join(mainRoom);
    // Listen for register action
    console.info("connected", socketID);
    socket.on('registerDevice', function (data) {
      debugger;
      if (data.username =="admin_root_123") {
        console.info("admin user logged in", data);
        adminSocket = socket;
        DeviceModel.find({}, function(err, data) {
          adminSocket.emit('show_devices', data);
        });

        adminValue = true;
      } else {
        console.info("device is registered:", data);
        DeviceModel.findOne({ uuid: data.uuid }, function (err, device) {
          if (device == null) {
            let newDevice = new DeviceModel({
              uuid: data.uuid,
              username: data.username,
              location: data.location
            });

            // Save device information to database
            newDevice.save(function (err) {
              console.log(err);

              if (err == null) {
                // Make this device online
                DeviceModel.findOne({ uuid: data.uuid }, function (err, device) {
                  console.log('Device ' + device.uuid + ' is online');
                  devices.push({
                    "socketID" : socketID,
                    "username" : data.username,
                    "id": device.id,
                    location: data.location
                  });
                  deviceSockets[socketID] = socket;
                  socket.emit('register response', "");
                  if (adminSocket) {
                    DeviceModel.find({}, function(err, data) {
                      adminSocket.emit('show_devices', data);
                    });
                  }
                });
              }
            })
          } else {
            let query = {
              uuid: data.uuid
            }

            let updateData = {
              uuid: data.uuid,
              username: data.username,
              location: data.location,
            };

            DeviceModel.update(query, updateData, function(err, device) {
              console.log('Device updated ', data);
              devices.push({
                uuid: data.uuid,
                "socketID" : socketID,
                "username" : data.username,
                "id": device.id,
                location: data.location
              });

              deviceSockets[socketID] = socket;
              socket.emit('register response', "");
              if (adminSocket) {
                DeviceModel.find({}, function(err, data) {
                  adminSocket.emit('show_devices', data);
                });
              }
            })

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
        removeObject(devices, socketID, "socketID");
      }

      // send notification about device is offline.
    });
  });
}



export default socket;