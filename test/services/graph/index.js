import fetch from "isomorphic-fetch"
import {introspectionQuery} from "graphql"

var url = "http://localhost:8080/api/graph"

export default function graph() {
  return fetch(url, {
    body: JSON.stringify({
      query: introspectionQuery,
    }),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST'
  }).then((response) => {
    return response.json()
  }).then((response) => {
    var wrapper = {
      User: {
        "imageUrl": "image.small"
      }
    }

    return {
      url,
      metadata: response.data,
      wrapper
    }
  })
}
