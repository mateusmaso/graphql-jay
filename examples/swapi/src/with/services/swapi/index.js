import {adapter} from "graphql-jay-hyperschema"
import fetch from "isomorphic-fetch"
import {monitorFetch} from "../../../perf"

var url = "http://localhost:8000/api"

export default function swapi() {
  return monitorFetch(fetch)(`${url}/schema`).then((response) => {
    return response.json()
  }).then((metadata) => {
    var wrapper = {
      Query: {
        "allFilms": "allFilms.results"
      }
    }

    return {
      url,
      metadata,
      adapter,
      wrapper,
      fetch: monitorFetch(fetch)
    }
  })
}
