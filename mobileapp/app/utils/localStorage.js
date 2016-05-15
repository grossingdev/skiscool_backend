/**
 * Created by baebae on 4/6/16.
 */
/**
 * LocalStorage Wrapper
 */

let React = require('react-native');
let {
  AsyncStorage
} = React;

let base = '@skiscool-';

module.exports = {
  set(key, value) {
    return AsyncStorage.setItem(`${base}${key}`, value.toString());
  },

  get(key) {
    return AsyncStorage.getItem(`${base}${key}`);
  },

  remove(key) {
    return AsyncStorage.removeItem(`${base}${key}`);
  },

  clear() {
    return AsyncStorage.clear();
  }
}