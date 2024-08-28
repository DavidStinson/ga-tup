// npm
import chalk from 'chalk'

// types
import { LocalMsgs } from "../types.js"

// data setup
const log = console.log
const cSuccess = chalk.green
const cWarn = chalk.yellow
const cErr = chalk.bold.red

// do the thing
async function render(msgs: LocalMsgs) {
  await displayMessages(msgs)
  if (!msgs.failures.length) {
    log(cSuccess.bold(
      '🚀 Massive success! This module can be updated with no manual configuration'
    ))
  } else {
    log(cErr(
      '💥 This module has problems that you must manually resolve.'
    ))
  }
}

async function displayMessages(msgs: LocalMsgs) { 

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
  return new Promise(res => setTimeout(res, 80))
}

export {
  render
}
