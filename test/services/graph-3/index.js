import fetch from "node-fetch";
import {introspectionQuery} from "graphql";

var url = "http://localhost:8080/api/graph-3";

export default function graph3() {
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
