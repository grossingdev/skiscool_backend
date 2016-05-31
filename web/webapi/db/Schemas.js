/**
 * Created by baebae on 4/29/16.
 */
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const commonUserSchema = {
  id: Number,
  device_uuid: {type: String},
  //essential fields
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true},
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
      flagAdmin: Boolean,
      season_status: Schema.Types.Mixed, //will contains {lower: [weeknum, weeknum,...], medium: [weeknum], highest: [weeknum]}
    })
  ),

  Overlay: new Schema({
    id: Number,
    overlay_uuid: {type: String, required: true},
    overlay_type: Number, //should be hotel: 1, chalet: 2, restaurant: 3, ...
    location: [Number], //will contains [lat, lon]
  }),

  Boundary: new Schema({
    id: Number,
    fileName: String,
    name: String,
    base64Data: String,
    boundary: [Number], //will contains [start lat, start lon, end lat, end lon]
  }),

  Tiles: new Schema({
    _id: Number,
    x: Number,
    y: Number,
    z: Number,
    url_template: String
  })
};
export default Schemas;