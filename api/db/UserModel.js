/**
 * Created by baebae on 4/29/16.
 */
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import Schemas from './Schemas';
import bcrypt from 'bcrypt-nodejs';
import config from '../config'; // get our config file

let connection = mongoose.createConnection(config.mongo_db_url);
autoIncrement.initialize(connection);

Schemas.UserModel.pre('save', function(next) {
  // get the current date
  let currentDate = new Date();
  let component = this;
  // change the updated_at field to current date
  this.updated_at = currentDate;
  // if created_at doesn't exist, add to that field
  if (!this.created_at) {
    this.created_at = currentDate;
  }

  //check password is changed
  if ( !component.isModified('password') ) {
    return next();
  }

  // Password changed so we need to hash it using bcrypt
  bcrypt.genSalt( 5, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(component.password, salt, null, (err, hash) => {
      if (err) {
        return next(err);
      }
      component.salt = salt;
      component.password = hash;
      next();
    });
  });
});

Schemas.UserModel.plugin(autoIncrement.plugin, {
  model: 'UserModel',
  field: 'id',
  startAt: 1,
  incrementBy: 1,
});
const UserModel =  connection.model('UserModel', Schemas.UserModel);
// Create Database model schema
export default UserModel;
