"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Created by baebae on 4/29/16.
 */

var removeObject = exports.removeObject = function removeObject(object, removeKey, removeFieldKeyName) {
  for (var key in object) {
    var user = object[key];
    var _key = user[removeFieldKeyName];

    if (removeKey == _key) {
      object.splice(key, 1);
      return;
    }
  }
};

var findByKey = exports.findByKey = function findByKey(object, key, value) {
  for (var _key in object) {
    var _object = object[_key];

    if (_object[key] == value) {
      return _object;
    }
  }

  return null;
};