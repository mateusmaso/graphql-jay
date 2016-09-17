"use strict";

var _chai = require("chai");

var _graphql = require("graphql");

var _lib = require("../lib");

var _services = require("./services");

var graphQLJaySchema;

describe("graphql-jay", function () {
  before(function () {
    return (0, _lib.composeSchema)(_services.graph, _services.graph2, _services.graph3).then(function (schema) {
      graphQLJaySchema = schema;
    }).catch(function (error) {
      console.log("Error", error);
    });
  });

  it("should request user", function () {
    return (0, _graphql.graphql)(graphQLJaySchema, "{\n      user(id: 1) {\n        id\n        age\n        name\n        email\n        image {\n          small\n        }\n      }\n    }").then(function (response) {
      console.log("Response", JSON.stringify(response));
      (0, _chai.expect)(response.data).to.have.keys("user");
    });
  });
});