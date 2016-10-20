import Bluebird from "bluebird"
import perf from "../../perf"

export function resolveField(object, fieldName) {
  var field = object[fieldName]

  if (Array.isArray(field)) {
    object[fieldName] = []

    return Bluebird.each(field, (url) => {
      return perf.monitorFetch(fetch)(url).then((response) => {
        return response.json()
      }).then((response) => {
        object[fieldName].push(response)
      })
    })
  } else {
    return perf.monitorFetch(fetch)(field).then((response) => {
      return response.json()
    }).then((response) => {
      object[fieldName] = response
    })
  }
}
