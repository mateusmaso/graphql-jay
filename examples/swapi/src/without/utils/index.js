import Bluebird from "bluebird"
import {monitorFetch} from "../../perf"

export function resolveField(object, fieldName) {
  var field = object[fieldName]

  if (Array.isArray(field)) {
    object[fieldName] = []

    return Bluebird.each(field, (url) => {
      return monitorFetch(fetch)(url).then((response) => {
        return response.json()
      }).then((response) => {
        object[fieldName].push(response)
      })
    })
  } else {
    return monitorFetch(fetch)(field).then((response) => {
      return response.json()
    }).then((response) => {
      object[fieldName] = response
    })
  }
}
