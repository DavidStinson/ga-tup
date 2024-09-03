// npm
import ora from "ora"

// local
import {
  getData as getFileData,
  getPureData as getPureFileData,
} from "./file-fetch.js"

// types
import { Data } from "../../types.js"

// do the thing
async function collect(iD: Data) {
  const { files } = iD

  const dataSpinner = ora({
    text: "Retrieving template data...",
    spinner: "triangle",
  })
  dataSpinner.start()

  // This is only here to keep TS happy, we can't get to this point if typeUrl 
  // is "". typeUrl must be assigned by a user in the preflight check.
  const urlType = iD.module.meta.type === "lab" 
    ? "lectureTemplateUrl"
    : "labTemplateUrl"

  try {
    iD.files.defaultLayout = await getFileData(files.defaultLayout, urlType)
    iD.files.rootReadme = await getFileData(files.rootReadme, urlType)
    iD.files.videoHub = await getFileData(files.videoHub, urlType)
    iD.files.releaseNotes = await getFileData(files.releaseNotes, urlType)
    iD.files.instructorGuide = await getFileData(files.instructorGuide, urlType)
    iD.files.references = await getFileData(files.references, urlType)
    iD.files.originalAssetsReadmeTemplate = await getPureFileData(
      files.originalAssetsReadmeTemplate,
      urlType
    )
    iD.files.fallbackCanvasLandingPageTemplate = await getPureFileData(
      files.fallbackCanvasLandingPageTemplate,
      urlType
    )

    if (dataSpinner.isSpinning) {
      dataSpinner.succeed("Retrieved templates!")
    }

    return iD
  } catch (error) {
    if (dataSpinner.isSpinning) {
      dataSpinner.fail("Failed to retrieve templates.")
    }
    process.exit(0)
  }
}

export { collect }
