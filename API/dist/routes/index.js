'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Created by baebae on 4/29/16.
 */
var routes = exports.routes = function routes(app) {
  // Setting template engine Pug
  app.set('views', __dirname + '/tpl');
  app.set('view engine', "pug");
  app.engine('pug', require('pug').__express);

  app.get("/", function (req, res) {
    res.render("index");
  });

  app.get("/*", function (req, res) {
    res.render("index");
  });
};

exports.default = routes;