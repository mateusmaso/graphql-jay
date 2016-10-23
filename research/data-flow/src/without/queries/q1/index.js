import fetch from "isomorphic-fetch"
import Bluebird from "bluebird"
import {resolveField} from "../../utils"
import {monitorFetch} from "../../../perf"

export default function q1() {
  return new Promise((resolve) => {
    monitorFetch(fetch)("http://localhost:8000/api/films").then((response) => {
      return response.json()
    }).then((response) => {
      var films = response.results

      Bluebird.each(films, (film) => {
        return resolveField(film, "characters").then(() => {
          return Bluebird.each(film.characters, (character) => {
            return resolveField(character, "homeworld")
          })
        })
      }).then(() => {
        var filmWithDesertCharacters = films.map((film) => {
          var count = 0

          film.characters.forEach((character) => {
            if (character.homeworld.climate.split(", ").indexOf("arid") >= 0) {
              count++
            }
          })

          return {
            film,
            count
          }
        })

        filmWithDesertCharacters.sort((a, b) => {
          return a.count < b.count
        })

        resolve(`Q1: ${filmWithDesertCharacters[0].film.title}`)
      })
    })
  })
}
