"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = swapi;

var _graphqlJayHyperschema = require("graphql-jay-hyperschema");

var url = "http://localhost:8000/api";

function swapi() {
  return fetch(url + "/schema").then(function (response) {
    return response.json();
  }).then(function (schema) {
    var wrapper = {
      Query: {
        "allFilms": "allFilms.results"
      }
    };

    return {
      url: url,
      schema: schema,
      adapter: _graphqlJayHyperschema.adapter,
      wrapper: wrapper
    };
  });
}