/**
 * Created by baebae on 4/29/16.
 */
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import Schemas from './Schemas';
import config from '../config'; // get our config file
let connection = mongoose.createConnection(config.mongo_db_url);
autoIncrement.initialize(connection);

Schemas.DeviceModel.pre('save', function(next) {
  // get the current date
  let currentDate = new Date();
  // change the updated_at field to current date
  this.updated_at = currentDate;
  // if created_at doesn't exist, add to that field
  if (!this.created_at) {
    this.created_at = currentDate;
  }
  next();
});


Schemas.DeviceModel.plugin(autoIncrement.plugin, {
  model: 'DeviceModel',
  field: 'id',
  startAt: 1,
  incrementBy: 1
});
const DeviceModel =  connection.model('DeviceModel', Schemas.DeviceModel);
// Create Database model schema
export default DeviceModel;
