// local
import {
  buildLandingHeading,
  removeHero,
  updatePrefixAndHeadline,
} from "./helpers.js"

// types
import { Data, Files, Module, File } from "../../types.js"

// do the thing
function buildNewCanvasLandingPages(iD: Data): File[] {
  const { files, module } = iD

  const migratedPages = migrateExistingPages(files.canvasLandingPages, module)

  if (!module.meta.didContainFallbackClp) {
    migratedPages.push(buildFallbackClp(files, module))
  }

  return migratedPages
}

function migrateExistingPages(files: File[], module: Module): File[] {
  files.forEach((file, idx) => {
    files[idx] = migrateExistingPage(file, module)
  })
  return files
}

function migrateExistingPage(file: File, module: Module): File {
  const headline = buildLandingHeading(module)

  if (file.canUpdateHeader) {
    const oldFileNoHero = removeHero(file.oldFile)
    file.newFile = headline + oldFileNoHero
  } else {
    file.newFile = headline + file.oldFile
  }
  return file
}

function buildFallbackClp(files: Files, module: Module): File {
  const fallbackClpWithHeadline = updatePrefixAndHeadline(
    files.fallbackCanvasLandingPageTemplate.templateFile, module
  )

  return {
    type: "file",
    path: "./canvas-landing-pages/fallback.md",
    oldFile: "",
    newFile: fallbackClpWithHeadline,
    canUpdateHeader: true,
    isFound: false,
    isMigrated: false,
  }
}

export { buildNewCanvasLandingPages }
