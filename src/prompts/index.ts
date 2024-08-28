// npm
import { confirm } from "@inquirer/prompts"

// local
import { verifyData as verifyLocalData } from "./verify-local.js"

// types
import { Data } from "../types.js"

// do the thing
async function promptContinue(msg: string) {
  try {
    if (!(await confirm({ message: msg }))) process.exit(0)
  } catch (error) {
    process.exit(0)
  }
}

async function verify(iD: Data): Promise<Data> {
  return await verifyLocalData(iD)
}

export { promptContinue, verify }
