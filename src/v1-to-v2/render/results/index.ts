// npm
import chalk from "chalk"

// types
import type { Data } from "../../types.js"

// local
import { renderMessages } from "../helpers.js"

// data setup
const log = console.log
const cSuccess = chalk.green
const cErr = chalk.bold.red

// do the thing
async function render(iD: Data): Promise<void> {
  await renderMessages(iD.resultMsgs)
  if (!iD.resultMsgs.failures.length) {
    log(
      cSuccess.bold(
        "🚀 Massive success! This module was fully updated and requires no further manual configuration.",
      ),
    )
  } else {
    log(cErr("💥 This module has problems that you must manually resolve."))
  }
}

export { render }
