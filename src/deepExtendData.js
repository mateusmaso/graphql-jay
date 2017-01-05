import deepAssign from "deep-assign"

export function deepExtendData(...data) {
  return deepAssign(...data)
}
