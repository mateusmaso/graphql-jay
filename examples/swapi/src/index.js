import runWith from "./with"
import runWithout from "./without"
import perf from "./perf"
import fs from "fs"

function buildData(response) {
  var q1 = response[0] == "Q1: Revenge of the Sith"
  var q2 = response[1] == "Q2: Droid"
  var q3 = response[2] == "Q3: Chewbacca"

  var answerRate = (q1 + q2 + q3) / 3

  return Object.assign({
    answerRate
  }, perf())
}

function writeData(data) {
  return fs.writeFileSync('data.json', JSON.stringify(data, 0, 2))
}

function run() {
  var withData = {}
  var withoutData = {}

  return runWith().then((response) => {
    withData = buildData(response)
    return runWithout()
  }).then((response) => {
    withoutData = buildData(response)

    return {
      "with": withData,
      "without": withoutData
    }
  })
}

run().then((data) => {
  return writeData(data)
}).catch((error) => {
  console.warn(error)
})
