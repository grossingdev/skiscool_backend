/**
 * Created by BaeBae on 5/7/16.
 */
const prefix = '@skiscool-';

let Store = null;
__CLIENT__ ? Store = window.localStorage : Store = null;

/**
 * Gets an item from localStorage
 * @param  {string} id
 *
 */
export const get = (id) => {
  return new Promise((resolve, reject) => {
    try {
      let value = JSON.parse(Store.getItem(`${prefix}${id}`)).value;
      resolve(value)
    } catch (err) {
      return null;
    }
  });

};

/**
 * Sets an item in localStorage
 * @param  {String} id
 * @param  {Any}    value
 *
 */
export const set = (id, value) => {
  return Store.setItem(`${prefix}${id}`, JSON.stringify({ value }));
};

export default {
  get,
  set
};