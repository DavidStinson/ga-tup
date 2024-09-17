// types
import type { Data } from "../../types.js"

// local
import { process as processTemplateItems } from "./template-items.js"
import { process as processAssets } from "./assets.js"
import { process as processClps } from "./clps.js"
import { process as processMls } from "./mls.js"

// do the thing
function process(iD: Data) {
  iD.resultMsgs = processTemplateItems(iD)
  iD.resultMsgs = processAssets(iD)
  iD.resultMsgs = processClps(iD)
  iD.resultMsgs = processMls(iD)

  return iD
}

export { process }
