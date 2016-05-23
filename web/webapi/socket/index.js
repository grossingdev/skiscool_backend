/**
 * Created by baebae on 5/3/16.
 */
import socketIO from 'socket.io';
import sockjs from 'sockjs';
import {removeObject} from '../utils/utils';
import Client from '../db/ClientsModel';
import checkAuth from '../actions/account/checkAuth';
import _ from 'lodash';

let adminSockets = [];
let onlineSockets = [];

const updateAdmin = (socket, data) => {
  let message = {
    method: 'show_devices',
    data: {
      devices: data,
      online: onlineSockets
    }
  }
  socket.write(JSON.stringify(message));
};

const updateAllAdmin = () => {
  Client.find({ location: { $gt:[] } }, {name: 1, location: 1, email: 1, device_uuid: 1, updated: 1}, function(err, data) {
    _.forEach(adminSockets, (adminSocket) => {
      if (err) {
        let message = {
          method: 'error',
          data: err
        };
        adminSocket.socket.write(JSON.stringify(message));
      } else {
        updateAdmin(adminSocket.socket, data)
      }
    });
  });
}

const registerDevice = (data, socket) => {
  if (data.email =="admin_simon@gmail.com") {
    //if admin registered
    console.info("admin user logged in", data);

    //update admin sockets
    adminSockets.push({
      socket: socket,
      socketId: socket.id
    });

    //return current device information
    Client.find({ location: { $gt:[] } }, {name: 1, location: 1, email: 1, device_uuid: 1, updated: 1}, function(err, data) {
      updateAdmin(socket, data);
    });
  } else {
    console.info("device is registered:", data);

    //check device is registered
    Client.findOne({ email: data.email }, function (err, user) {

      //if no devices from database
      if (user != null) {
        //update device username, location
        let updateData = {
          device_uuid: data.device_uuid,
          location: data.location,
          updated: new Date()
        };
        Client.update({email: data.email}, updateData, function(err, user) {
          if (!err && user) {
            console.log('User location updated ', user);
            onlineSockets.push({
              socketId: socket.id,
              device_uuid: user.device_uuid
            });

            let message = {
              method: 'register response',
              data: ''
            };

            socket.write(JSON.stringify(message));
            updateAllAdmin();
          }
        })
      }
    });
  }
};

const socket = (server) => {
  //socket.io
    // let socketServer = socketIO.listen(server);
    //
    // let mainRoom = 'skiscool_room';
    //
    // // Initiate socket to handle all connection
    // socketServer.sockets.on('connection', function (socket) {
    //   let socketID = socket.id;
    //   socket.join(mainRoom);
    //
    //   // Listen for register action
    //   console.info("connected", socketID);
    //
    //   socket.on('registerDevice', function (data) {
    //     //check user is logged in.
    //     checkAuth(data.token, true)
    //       .then((user) => {
    //         registerDevice(data, socket);
    //       });
    //   });
    //
    //   // Listen for disconnect event
    //   socket.on('disconnect', function () {
    //     // Update device  online status
    //     console.info("disconnected");
    //
    //     //remove disconnected socket from online, admin sockets array;
    //     removeObject(onlineSockets, socketID, "socketId");
    //     removeObject(adminSockets, socketID, "socketId");
    //   });
    // });

  //sock js
  let sockjs_opts = {sockjs_url: "http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js"};
  let deviceEcho = sockjs.createServer(sockjs_opts);
  deviceEcho.on('connection', (conn) => {
    let socketID = conn.id;
    console.info('new sock js connection: ', socketID);
    conn.on('data', (strMessage) => {
      //check user is logged in.
      let message = JSON.parse(strMessage);
      if (message.method == 'registerDevice') {
        checkAuth(message.data.token, true)
          .then((user) => {
            registerDevice(message.data, conn);
          });
      }
    });

    conn.on('close', () => {
      console.info("disconnected");
      removeObject(onlineSockets, socketID, "socketId");
      removeObject(adminSockets, socketID, "socketId");
    });
  });

  deviceEcho.installHandlers(server, {prefix:'/device'});
}

export default socket;