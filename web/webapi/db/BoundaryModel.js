/**
 * Created by baebae on 5/19/16.
 */
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import Schemas from './Schemas';
import config from '../config'; // get our config file

let connection = mongoose.createConnection(config.mongo_db_url);
autoIncrement.initialize(connection);

Schemas.Boundary.plugin(autoIncrement.plugin, {
  model: 'Boundary',
  field: 'id',
  startAt: 1,
  incrementBy: 1,
});
const Boundary =  connection.model('Boundary', Schemas.Boundary);
// Create Database model schema
export default Boundary;
