// local
import { buildNewTemplateFiles } from "./new-template-files.js"
import { buildNewCanvasLandingPages } from "./new-canvas-landing-pages.js"
// types
import { Data } from "../../types.js"

async function build(iD: Data) {
  iD.files = buildNewTemplateFiles(iD)
  iD.files.canvasLandingPages = buildNewCanvasLandingPages(iD)

  return iD
}

export { build }
