/**
 * Created by baebae on 4/29/16.
 */
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const commonUserSchema = {
  id: Number,
  device_uuid: {type: String},
  //essential fields
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  gender: { type: String, required: true},
  age: {type: String, required: true},
  age_range: {type: String, required: true},

  //extra fields
  image: String,
  location: [Number], //will contains [lat, lon]
  level: Schema.Types.Mixed, //will contains {ski_level: 0~4, ski_speed: number, etc}
  languages: [String], //will contains ['en', 'ru']
  meta: Schema.Types.Mixed, //will contains {friend_list: [objects], etc}
  updated: { type: Date, default: Date.now },
  online_status: Boolean
};

const Schemas = {

  Client: new Schema(
    Object.assign({}, commonUserSchema)
  ),

  Instructor: new Schema(
    Object.assign({}, commonUserSchema, {
      schedule: Schema.Types.Mixed, //will contains array of [date, date]
      rate: Number,
      season_status: Schema.Types.Mixed, //will contains {lower: [weeknum, weeknum,...], medium: [weeknum], highest: [weeknum]}
    })
  ),

  Hotel: new Schema({
    id: Number,
    hotel_name: { type: String, required: true},
    hotel_icon: String,
    hotel_price: {type: Number, required: true},
    hotel_type: String, //should be hotel/chalet
  })
};
export default Schemas;