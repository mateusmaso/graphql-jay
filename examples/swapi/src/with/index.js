import {q1, q2, q3} from "./queries"
import {composeSchema} from "graphql-jay"
import {swapi, swapiGraphQL} from "./services"
import {monitorComposeSchema} from "../perf"

export default function run() {
  return monitorComposeSchema(composeSchema)(swapi).then((schema) => {
    return Promise.all([
      q1(schema),
      q2(schema),
      q3(schema)
    ])
  })
}
