import now from "performance-now"

var responseTime = 0
var responseSize = 0
var requestCount = 0
var overheadTime = 0

function monitorFetch(fetch) {
  return function(a) {
    requestCount++
    var fetchTime = now()

    console.log(a)

    return fetch.apply(this, arguments).then((response) => {
      responseTime += (now() - fetchTime)
      return response.clone().text().then((text) => {
        responseSize += text.length
        return response
      })
    })
  }
}

var schemaCreationTime
var schemaFetchingTime

function schemaCreation() {
  schemaCreationTime = now()
}

function schemaCreationEnd() {
  overheadTime += now() - schemaCreationTime
  schemaCreationTime = 0
}

function schemaFetching() {
  schemaFetchingTime = now()
}

function schemaFetchingEnd() {
  overheadTime += now() - schemaFetchingTime
  schemaFetchingTime = 0
}

function clean() {
  if (overheadTime != 0) {
    overheadTime -= responseTime
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

var perf = {
  monitorFetch,
  schemaCreation,
  schemaCreationEnd,
  schemaFetching,
  schemaFetchingEnd,
  clean
}

export default perf
