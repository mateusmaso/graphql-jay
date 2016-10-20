import {expect} from "chai"
import {graphql} from "graphql"
import {composeSchema} from "../lib"
import {graph, graph2, graph3} from "./services"

describe("graphql-jay", () => {
  var schema

  before(() => {
    return composeSchema(graph, graph2, graph3).then((_) => {
      schema = _
    }).catch((error) => {
      console.warn(error)
    })
  })

  it("should request user", () => {
    return graphql(schema, `{
      user(id: 1) {
        id
        age
        name
        email
        imageUrl
      }
    }`).then((response) => {
      console.log(JSON.stringify(response))
      expect(response.data).to.have.keys("user")
    })
  })
})
