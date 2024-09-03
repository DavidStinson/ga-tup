// types
import { Data, Msgs } from "../../types.js"

// do the thing
function process(iD: Data): Data {
  iD.envMsgs = pklFound(iD.envMsgs, iD.env.isPklInstalled)
  return iD
}

function pklFound(msgs: Msgs, isPklInstalled: boolean): Msgs {
  if (isPklInstalled) {
    msgs.successes.push("Pkl is installed. A config.json file will be created with a fallback course. All other courses will need to be manually migrated.")
  } else {
    msgs.failures.push("Pkl is not installed. A config.json file will not be created for this module.")
  }
  return msgs
}

export { process }
