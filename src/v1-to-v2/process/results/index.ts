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

  // tktk HEY ALSO DON'T FORGET TO CHECK IF A LECTURE WAS FOUND IN THE ROOT
  // README.md FILE. IF IT WASN'T FOUND, THEN ITS ml.mlOrder WILL BE -1.

  // tktk ALSO ALSO DON'T FORGET TO CHECK IF THE CONFIG.JSON FILE WAS CREATED
  // ON iD.module.meta.createdConfigJson
}

export { process }
