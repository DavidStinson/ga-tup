// local
import {
  buildLandingHeading,
  removeHero,
  updatePrefixAndHeadline,
} from "./helpers.js"

// types
import { Data, Files, Module, ClpFile } from "../../types.js"

// do the thing
function build(iD: Data): ClpFile[] {
  const { files, module } = iD

  const migratedPages = migrateExistingPages(files.clps, module)

  if (
    !module.meta.containsFallbackClp &&
    files.fallbackCanvasLandingPageTemplate.templateFileFetched
  ) {
    migratedPages.push(buildFallbackClp(files, module))
  }

  return migratedPages
}

function migrateExistingPages(files: ClpFile[], module: Module): ClpFile[] {
  files.forEach((file, idx) => {
    files[idx] = migrateExistingPage(file, module)
  })
  return files
}

function migrateExistingPage(file: ClpFile, module: Module): ClpFile {
  const headline = buildLandingHeading(module)

  if (file.canUpdateHeading) {
    const oldFileNoHero = removeHero(file.curFileContent)
    file.newFileContent = headline + oldFileNoHero
    file.didUpdateHeading = true
  } else {
    file.newFileContent = headline + file.curFileContent
  }
  return file
}

function buildFallbackClp(files: Files, module: Module): ClpFile {
  const fallbackClpWithHeadline = updatePrefixAndHeadline(
    files.fallbackCanvasLandingPageTemplate.templateFile,
    module,
  )

  const fallbackClp = new ClpFile({
    fileName: "fallback",
    fileType: "md",
    displayName: "FallbackCanvas Landing Page",
    curPath: "",
    curFileContent: "",
    desiredPath: "./canvas-landing-pages/fallback.md",
    isFound: false,
  })

  return {
    ...fallbackClp,
    newFileContent: fallbackClpWithHeadline,
    canUpdateHeading: true,
    didUpdateHeading: true,
    shouldCreate: true,
    canMoveOrCreate: true,
    didMoveOrCreate: false,
  }
}

export { build }
