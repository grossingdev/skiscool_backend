'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseAutoIncrement = require('mongoose-auto-increment');

var _mongooseAutoIncrement2 = _interopRequireDefault(_mongooseAutoIncrement);

var _schema = require('./schema');

var _schema2 = _interopRequireDefault(_schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mongo_db_url = 'mongodb://localhost:27017/chat'; /**
                                                      * Created by baebae on 4/29/16.
                                                      */

var connection = _mongoose2.default.createConnection(mongo_db_url);
_mongooseAutoIncrement2.default.initialize(connection);

_schema2.default.DeviceModel.pre('save', function (next) {
  // get the current date
  var currentDate = new Date();
  // change the updated_at field to current date
  this.updated_at = currentDate;
  // if created_at doesn't exist, add to that field
  if (!this.created_at) {
    this.created_at = currentDate;
  }
  next();
});

_schema2.default.DeviceModel.plugin(_mongooseAutoIncrement2.default.plugin, {
  model: 'DeviceModel',
  field: 'id',
  startAt: 1,
  incrementBy: 1
});
var DeviceModel = connection.model('DeviceModel', _schema2.default.DeviceModel);
// Create Database model schema
exports.default = DeviceModel;