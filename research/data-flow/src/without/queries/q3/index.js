import fetch from "isomorphic-fetch"
import Bluebird from "bluebird"
import {resolveField} from "../../utils"
import groupBy from "group-by"
import {monitorFetch} from "../../../perf"

export default function q3() {
  return new Promise((resolve) => {
    monitorFetch(fetch)("http://localhost:8000/api/films/1").then((response) => {
      return response.json()
    }).then((aNewHope) => {
      resolveField(aNewHope, "starships").then(() => {
        return resolveField(aNewHope, "vehicles")
      }).then(() => {
        var pilots = []

        aNewHope.starships.forEach((starship) => {
          starship.pilots.forEach((pilot) => {
            pilots.push(pilot)
          })
        })

        aNewHope.vehicles.forEach((vehicle) => {
          vehicle.pilots.forEach((pilot) => {
            pilots.push(pilot)
          })
        })

        var pilotsByName = groupBy(pilots, "name")

        var pilotNames = Object.keys(pilotsByName).sort((a, b) => {
          return pilotsByName[a].length > pilotsByName[b].length
        })

        resolve(`Q3: ${pilotNames[0]}`)
      })
    })
  })
}
