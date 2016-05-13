/* global Promise */
/**
 * Created by damonshelton on 1/15/16.
 */
/**
 * API
 */

import request from 'superagent'
import _ from 'lodash';
import {apiResult$} from 'redux/actions/APIResultActions';

let config = require('../config');

let base = 'http://ns327841.ip-37-187-112.eu:3700'
if (config.isProduction) {
  base = 'http://ns327841.ip-37-187-112.eu:3700';
} else {
  base = 'http://localhost:3700';
}

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
function _publicRequest(method, route, params, body, dispatch) {
  if (!body) body = {};
  if (params) route = _parameterizeRoute(route, params);
  return new Promise((resolve, reject) => {
    request(method, base + route)
      .accept('application/json')
      .send(body)
      .end((err, res) => {
        if (!res) {
          console.info("Network error");
          return dispatch(apiResult$({
            err_code: -1,
            err_msg: "Network Error."
          }))
        } else if (err) {
          console.info("API error:" + route, res.body);
          if (dispatch) {
            dispatch(apiResult$({
              error_code: res.body.statusCode,
              msg: res.body.msg
            }));
          }
        } else {
          console.info("result:" + route, res.body);
          if (dispatch) {
            dispatch(apiResult$({
              error_code: 0,
              msg: res.body.message
            }));
          }
          resolve(res.body);
        }
      });
  });
}

function _generateRequest(options) {
   return  _publicRequest.bind(this, options.method, options.route);
}

