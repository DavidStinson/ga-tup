// types
import { Data, Msgs } from "../types.js"

// local
import { render } from "./messages.js"

// do the thing
async function renderRepoAndEnvData(iD: Data): Promise<void> {
  const msgs = mergeMsgArrays(iD.envMsgs, iD.repoMsgs)
  await render(msgs)
}

function mergeMsgArrays(envMsgs: Msgs, repoMsgs: Msgs): Msgs {
  const msgs = {
    successes: [...envMsgs.successes, ...repoMsgs.successes],
    warnings: [...envMsgs.warnings, ...repoMsgs.warnings],
    failures: [...envMsgs.failures, ...repoMsgs.failures],
  }
  return msgs
}

export { renderRepoAndEnvData }
