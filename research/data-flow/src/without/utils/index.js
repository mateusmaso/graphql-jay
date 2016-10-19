import Bluebird from "bluebird"

export function resolveField(object, fieldName) {
  var field = object[fieldName]

  if (Array.isArray(field)) {
    object[fieldName] = []

    return Bluebird.each(field, (url) => {
      return fetch(url).then((response) => {
        return response.json()
      }).then((response) => {
        object[fieldName].push(response)
      })
    })
  } else {
    return fetch(field).then((response) => {
      return response.json()
    }).then((response) => {
      object[fieldName] = response
    })
  }
}
