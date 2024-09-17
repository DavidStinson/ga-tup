// npm
import chalk from "chalk"

// types
import type { Msgs, ResultMsgs } from "../types.js"

// data setup
const log = console.log
const cInfo = chalk.cyan
const cSuccess = chalk.green
const cWarn = chalk.yellow
const cErr = chalk.bold.red

// do the thing
async function renderMessages(msgs: Msgs | ResultMsgs) {
  if ("unchanged" in msgs) {
    for (const msg of msgs.unchanged) {
      await timer()
      infoMessage(msg)
    }
  }

  for (const msg of msgs.successes) {
    await timer()
    successMessage(msg)
  }
  for (const msg of msgs.warnings) {
    await timer()
    warningMessage(msg)
  }
  for (const msg of msgs.failures) {
    await timer()
    failureMessage(msg)
  }
}

async function infoMessage(msg: string) {
  log(cInfo("ℹ"), msg)
}

async function successMessage(msg: string) {
  log(cSuccess(`✔ ${msg}`))
}

async function warningMessage(msg: string) {
  log(cWarn(`⚠️ ${msg}`))
}

async function failureMessage(msg: string) {
  log(cErr(`❌ ${msg}`))
}

function timer() {
  return new Promise((res) => setTimeout(res, 80))
}

export { renderMessages }
