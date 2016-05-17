/**
 * Created by baebae on 4/29/16.
 */

export const removeObject = (object, removeKey, removeFieldKeyName) => {
  for (let key in object) {
    var user = object[key];
    var _key = user[removeFieldKeyName];

    if (removeKey == _key) {
      object.splice(key, 1);
      return;
    }
  }
}

export const findByKey = (object, key, value) => {
  for (let _key in object) {
    var _object = object[_key];

    if (_object[key] == value) {
      return _object;
    }
  }

  return null;
}