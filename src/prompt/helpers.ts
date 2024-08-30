// node
import os from "node:os"

// npm
import { confirm } from "@inquirer/prompts"

// types
import { Dir } from "../types.js"

async function promptContinue(msg: string) {
  try {
    if (!(await confirm({ message: msg }))) process.exit(0)
  } catch (error) {
    process.exit(0)
  }
}

function getMlNamesForConsole(mls: Dir[]): string {
  let mlNames = ""
  mls.forEach((ml, idx) => {
    const isLast = idx === mls.length - 1
    mlNames += `  ${ml.dirNameTitleCase}${isLast ? "" : os.EOL}`
  })

  return mlNames.trimStart()
}

export { promptContinue, getMlNamesForConsole }
