import now from "performance-now"

var responseTime = 0
var responseSize = 0
var requestCount = 0
var overheadTime = 0

export function monitorFetch(fetch) {
  return function() {
    requestCount++
    var fetchTime = now()

    return fetch.apply(this, arguments).then((response) => {
      responseTime += (now() - fetchTime)
      return response.clone().text().then((text) => {
        responseSize += text.length
        return response
      })
    })
  }
}

export function monitorGraphQL(graphql) {
  return function() {
    var queryTime = now()

    return graphql.apply(this, arguments).then((response) => {
      overheadTime += (now() - queryTime)
      return response
    })
  }
}

export function monitorComposeSchema(composeSchema) {
  return function() {
    var composeTime = now()

    return composeSchema.apply(this, arguments).then((response) => {
      overheadTime += (now() - composeTime)
      return response
    })
  }
}

export default function perf() {
  if (overheadTime != 0) {
    overheadTime = overheadTime - responseTime
  }

  var data = {
    responseTime,
    responseSize,
    requestCount,
    overheadTime
  }

  responseTime = 0
  responseSize = 0
  requestCount = 0
  overheadTime = 0

  return data
}
