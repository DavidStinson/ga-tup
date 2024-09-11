// types
import { Data } from "../../types.js"

// local
import { process as processTemplateDirs } from "./template-items.js"

// do the thing
function process(iD: Data) {
  iD.resultMsgs = processTemplateDirs(iD)

  // tktk HEY YOU DON'T FORGET TO CHECK IF THE FALLBACK CLP WAS CREATED WITH:
  // if (
  //   !module.meta.containsFallbackClp && 
  //   files.fallbackCanvasLandingPageTemplate.templateFileFetched
  // )
}

export { process }
