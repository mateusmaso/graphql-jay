import now from "performance-now"

var __fetchingTime = 0
var responseSize = 0
var requestCount = 0
var metadataFetchingTime = 0
var processingTime = 0

export function monitorFetch(fetch) {
  return function() {
    requestCount++
    var time = now()

    return fetch.apply(this, arguments).then((response) => {
      __fetchingTime += (now() - time)
      return response.clone().text().then((text) => {
        responseSize += text.length
        return response
      })
    })
  }
}

export function monitorGraphQL(graphql) {
  return function() {
    var time = now()

    return graphql.apply(this, arguments).then((response) => {
      processingTime += (now() - time - __fetchingTime)
      __fetchingTime = 0
      return response
    })
  }
}

export function monitorComposeSchema(composeSchema) {
  return function() {
    var time = now()

    return composeSchema.apply(this, arguments).then((response) => {
      processingTime += (now() - time - __fetchingTime)
      metadataFetchingTime = __fetchingTime
      responseSize = 0
      requestCount = 0
      __fetchingTime = 0
      return response
    })
  }
}

export default function perf() {
  var data = {
    responseSize,
    requestCount,
    metadataFetchingTime,
    processingTime
  }

  responseSize = 0
  requestCount = 0
  metadataFetchingTime = 0
  processingTime = 0

  return data
}
