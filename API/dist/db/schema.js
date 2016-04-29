'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema; /**
                                         * Created by baebae on 4/29/16.
                                         */


var Schemas = {
  DeviceModel: new Schema({
    id: Number,
    uuid: { type: String, required: true, unique: true },
    location: { type: String, requrired: true },
    username: { type: String, required: true },
    created_at: Date,
    updated_at: Date
  })
};
exports.default = Schemas;