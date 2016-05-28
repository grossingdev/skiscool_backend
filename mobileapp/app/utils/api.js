/* global Promise */
/**
 * Created by damonshelton on 1/15/16.
 */
/**
 * API
 */

import request from 'superagent'
import _ from 'lodash';
import {apiResult$} from '../redux/actions/APIResultActions';
import LocalStorage from './localStorage';

// let base = 'http://ns327841.ip-37-187-112.eu:3700'
let base = 'http://localhost:3700';

export default {
  account: {
    login: _generateRequest({
      token: false,
      method: 'POST',
      route: '/account/login',
    }),
    logout: _generateRequest({
      token: false,
      method: 'GET',
      route: '/account/logout',
    }),
    signIn: _generateRequest({
      token: false,
      method: 'POST',
      route: '/account/signIn',
    }),
    checkToken: _generateRequest({
      token: false,
      method: 'POST',
      route: '/account/checkToken',
    }),
  },
  overlay: {
    addPlaceMarker: _generateRequest({
      token: true,
      method: 'POST',
      route: '/overlay/addPlaceMarker',
    }),
    removePlaceMarker: _generateRequest({
      token: true,
      method: 'POST',
      route: '/overlay/removePlaceMarker',
    }),
    updatePlaceMarker: _generateRequest({
      token: true,
      method: 'POST',
      route: '/overlay/updatePlaceMarker',
    }),
    getPlaceMarkers: _generateRequest({
      token: false,
      method: 'GET',
      route: '/overlay/getPlaceMarkers',
    }),
  }
};

function _parameterizeRoute(route, params) {
  let parameterized = route;
  _.forEach(params, (v, k) => {
    if (typeof v === 'undefined') console.info(`warning: parameter ${k} was ${v}`);
    parameterized = parameterized.replace(':' + k, v);
  });
  return parameterized;
}

function _requestWithToken(accessToken, method, route, params, body, dispatch) {
  if (!body) body = {};
  if (params) route = _parameterizeRoute(route, params);
  return new Promise((resolve, reject) => {
    LocalStorage.get('token')
      .then((token) => {
        let backendRequest = request(method, base + route);
        backendRequest.accept('application/json');

        if (accessToken) {
          body.token = token;
        }

        backendRequest.send(body)
          .end((err, res) => {
            if (!res) {
              console.info("Network error");
              dispatch(apiResult$({
                err_code: -1,
                err_msg: "Network Error."
              }))
              resolve({});
            } else if (err) {
              console.info("API error:" + route, res.body);
              if (dispatch) {
                dispatch(apiResult$({
                  error_code: res.body.statusCode,
                  msg: res.body.msg
                }))
              };
              resolve(res.body);
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
      })
  });
}

function _generateRequest(options) {
  return  _requestWithToken.bind(this, options.token, options.method, options.route);
}

