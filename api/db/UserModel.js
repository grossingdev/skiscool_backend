/**
 * Created by baebae on 4/29/16.
 */
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import Schemas from './Schemas';

const mongo_db_url = 'mongodb://localhost:27017/skiscool';
let connection = mongoose.createConnection(mongo_db_url);
autoIncrement.initialize(connection);

Schemas.UserModel.pre('save', function(next) {
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


Schemas.UserModel.plugin(autoIncrement.plugin, {
  model: 'UserModel',
  field: 'id',
  startAt: 1,
  incrementBy: 1
});
const DeviceModel =  connection.model('UserModel', Schemas.UserModel);
// Create Database model schema
export default DeviceModel;
