// local
import { build as buildDirs } from "./dirs.js"
// types
import { Data } from "../../types.js"

async function build(iD: Data): Promise<Data> {

  iD.dirs = await buildDirs(iD)

  return iD
}

export { build }
