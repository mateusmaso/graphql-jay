import runWith from "./with"
import runWithout from "./without"
import perf from "./perf"

runWith().then(() => {
  console.log(perf.clean())
  return runWithout()
}).then(() => {
  console.log(perf.clean())
})
