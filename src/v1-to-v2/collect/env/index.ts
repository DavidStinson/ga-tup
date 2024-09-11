// node
import util from "node:util"
import { exec } from "node:child_process"

// types
import { Data } from "../../types.js"

// data setup
const execAsync = util.promisify(exec)

async function collect(iD: Data): Promise<Data> {
  iD.env.isPklInstalled = await getPklInstalled()
  return iD
}

async function getPklInstalled(): Promise<boolean> {
  try {
    const { stdout } = await execAsync("pkl --version")
    return stdout ? true : false
  } catch (error) {
    return false
  }
}

export { collect }
