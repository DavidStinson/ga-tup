// local
import { build as buildDirs } from "./dirs.js"
import { build as buildFiles } from "./files.js"
import { remove as removeAssets } from "./assets.js"
import { build as buildMeta } from "./module.js"

// types
import { Data } from "../../types.js"

// do the thing
async function build(iD: Data): Promise<Data> {
  iD.dirs = await buildDirs(iD)
  iD.files = await buildFiles(iD)
  iD.assets = await removeAssets(iD)
  iD.module.meta = await buildMeta(iD)

  return iD
}

export { build }
