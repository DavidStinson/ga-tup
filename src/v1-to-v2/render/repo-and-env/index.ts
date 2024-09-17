// npm
import chalk from "chalk"

// types
import type { Data, Msgs } from "../../types.js"

// local
import { renderMessages } from "../helpers.js"

// data setup
const log = console.log
const cSuccess = chalk.green
const cErr = chalk.bold.red

// do the thing
async function render(iD: Data): Promise<void> {
  const msgs = mergeMsgArrays(iD.envMsgs, iD.repoMsgs)
  await renderMessages(msgs)
  if (!msgs.failures.length) {
    log(
      cSuccess.bold(
        "🚀 Massive success! This module can be updated with minimal manual configuration.",
      ),
    )
  } else {
    log(cErr("💥 This module has problems that you must manually resolve."))
  }
}

function mergeMsgArrays(envMsgs: Msgs, repoMsgs: Msgs): Msgs {
  const msgs = {
    successes: [...envMsgs.successes, ...repoMsgs.successes],
    warnings: [...envMsgs.warnings, ...repoMsgs.warnings],
    failures: [...envMsgs.failures, ...repoMsgs.failures],
  }
  return msgs
}

export { render }
