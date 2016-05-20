/**
 * Created by baebae on 5/19/16.
 */
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import Schemas from './Schemas';
import config from '../config'; // get our config file

let connection = mongoose.createConnection(config.mongo_db_url);
autoIncrement.initialize(connection);

Schemas.Overlay.plugin(autoIncrement.plugin, {
  model: 'Overlay',
  field: 'id',
  startAt: 1,
  incrementBy: 1,
});
const Overlay =  connection.model('Overlay', Schemas.Overlay);
// Create Database model schema
export default Overlay;
