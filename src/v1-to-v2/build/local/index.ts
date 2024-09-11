// local
import { build as buildTemplateFiles } from "./template-files.js"
import { build as buildCanvasLandingPages } from "./canvas-landing-pages.js"
import { build as buildMicrolessonFiles } from "./microlessons-files.js"
import { build as buildPklFiles } from "./pkl-files.js"

// types
import { Data } from "../../types.js"

async function build(iD: Data) {  
  iD.files = buildTemplateFiles(iD)
  iD.files.clps = buildCanvasLandingPages(iD)
  iD.files.mls = buildMicrolessonFiles(iD.files.mls, iD.module)
  iD.files.lvlUpMls = buildMicrolessonFiles(iD.files.lvlUpMls, iD.module)
  iD.files = buildPklFiles(iD.files, iD.module)

  return iD
}

export { build }
