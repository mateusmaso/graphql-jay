import fetch from "isomorphic-fetch";
import deepAssign from "deep-assign";

export function fetchData(...requests) {
  return Promise.all(requests.map((request) => {
    return performRequest(request);
  })).then((responses) => {
    return deepAssign(...responses).data;
  });
}

function performRequest(request) {
  return Promise.all(request.map((link) => {
    var {href, next} = link;

    return fetch(href, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json();
    });
  })).then((responses) => {
    return deepAssign(...responses);
  });
}
