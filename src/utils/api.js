/* global Promise */
/**
 * Created by damonshelton on 1/15/16.
 */
/**
 * API
 */

import request from 'superagent'
import _ from 'lodash'
let base = 'http://localhost:3700'

export default {
  account: {
    login: _generateRequest({
      method: 'POST',
      route: '/account/login',
    }),
    logout: _generateRequest({
      method: 'GET',
      route: '/account/logout',
    }),
    signIn: _generateRequest({
      method: 'POST',
      route: '/account/signIn',
    }),
  },
};

function _parameterizeRoute(route, params) {
  let parameterized = route;
  _.forEach(params, (v, k) => {
    if (typeof v === 'undefined') console.info(`warning: parameter ${k} was ${v}`);
    parameterized = parameterized.replace(':' + k, v);
  });
  return parameterized;
}
function _publicRequest(method, route, params, body) {
  if (!body) body = {};
  if (params) route = _parameterizeRoute(route, params);
  return new Promise((resolve, reject) => {
    request(method, base + route)
      .accept('application/json')
      .send(body)
      .end((err, res) => {
        if (!res) { res = {}; }
        if (err) {
          console.info("error:" + route, err);
          reject(res.body);
        } else {
          console.info("result:" + route, res.body);
          resolve(res.body);
        }
      });
  });
}

function _generateRequest(options) {
   return  _publicRequest.bind(this, options.method, options.route);
}

