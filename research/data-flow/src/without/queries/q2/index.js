import fetch from "isomorphic-fetch"
import Bluebird from "bluebird"
import {resolveField} from "../../utils"
import groupBy from "group-by"
import {monitorFetch} from "../../../perf"

export default function q2() {
  return new Promise((resolve) => {
    monitorFetch(fetch)("http://localhost:8000/api/planets/1").then((response) => {
      return response.json()
    }).then((tatooine) => {
      resolveField(tatooine, "residents").then(() => {
        return Bluebird.each(tatooine.residents, (resident) => {
          return resolveField(resident, "species")
        })
      }).then(() => {
        var residentsBySpecies = groupBy(tatooine.residents, (resident) => {
          var name

          resident.species.forEach((specie) => {
            if (name) {
              name = `${name} & ${specie.name}`
            } else {
              name = specie.name
            }
          })

          return name || "Unknown"
        })

        var specieNames = Object.keys(residentsBySpecies).sort((a, b) => {
          return residentsBySpecies[a].length > residentsBySpecies[b].length
        })

        resolve(`Q2: ${specieNames[0]}`)
      }).catch(() => {
        resolve(`Q2: ?`)
      })
    })
  })
}
