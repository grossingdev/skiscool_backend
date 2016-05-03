/**
 * Created by baebae on 4/29/16.
 */
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Schemas = {
  DeviceModel: new Schema({
    id: Number,
    uuid: { type: String, required: true, unique: true },
    location: {type:String, requrired: true},
    username: {type: String, required: true},
    created_at: Date,
    updated_at: Date
  }),
  UserModel: new Schema({
    id: Number,
    userId: { type: String, required: true, unique: true },
    userName: {type: String, required: true},
    password: {type: String},
    created_at: Date,
    updated_at: Date
  }),
};
export default Schemas;