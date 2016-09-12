import {expect} from "chai";
import {graphql} from "graphql";
import {composeSchema} from "../lib";
import {graph, graph2, graph3} from "./services";

var graphQLJaySchema;

describe("graphql-jay", () => {
  before(() => {
    return composeSchema(graph, graph2, graph3).then((schema) => {
      graphQLJaySchema = schema;
    }).catch((error) => {
      console.log("Error", error);
    });
  });

  it("should request user", () => {
    return graphql(graphQLJaySchema, `{
      user(id: 1) {
        id
        age
        name
        email
        image {
          small
        }
      }
    }`).then((response) => {
      console.log("Response", JSON.stringify(response))
      expect(response.data).to.have.keys("user");
    });
  });
});
