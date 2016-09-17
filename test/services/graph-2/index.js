import fetch from "isomorphic-fetch";
import {introspectionQuery} from "graphql";

var url = "http://localhost:8080/api/graph-2";

export default function graph2() {
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
    return response.json();
  }).then((response) => {
    return {
      url,
      schema: response.data
    };
  });
};
