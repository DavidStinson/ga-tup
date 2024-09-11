// npm
import ora from "ora"

// local
import {
  getData as getFileData,
  getPureData as getPureFileData,
} from "./file-fetch.js"

// external
import { promptContinue } from "../../prompt/helpers.js"

// types
import { Data, Files, TemplateFile, PureTemplateFile } from "../../types.js"

// data setup
class ResponseError extends Error {
  res: Response

  constructor(message: string, res: Response) {
    super(message)
    this.res = res
  }
}

// do the thing
async function collect(iD: Data): Promise<Data> {
  const { files } = iD

  const dataSpinner = ora({
    text: "Retrieving template data...",
    spinner: "triangle",
  })
  dataSpinner.start()

  // This is only here to keep TS happy, we can't get to this point if typeUrl 
  // is "". typeUrl must be assigned by a user in the preflight check.
  if (!iD.module.meta.typeUrl) return iD
  const urlType = iD.module.meta.typeUrl

  // TODO: Would be good to get the file data in parallel
  iD.files.defaultLayout = await getFileData(files.defaultLayout, urlType)
  iD.files.rootReadme = await getFileData(files.rootReadme, urlType)
  iD.files.videoHub = await getFileData(files.videoHub, urlType)
  iD.files.releaseNotes = await getFileData(files.releaseNotes, urlType)
  iD.files.instructorGuide = await getFileData(files.instructorGuide, urlType)
  iD.files.references = await getFileData(files.references, urlType)
  iD.files.pklConfig = await getFileData(files.pklConfig, urlType)
  iD.files.pklMicrolessons = await getFileData(files.pklMicrolessons, urlType)
  iD.files.originalAssetsReadmeTemplate = await getPureFileData(
    files.originalAssetsReadmeTemplate,
    urlType
  )
  iD.files.fallbackCanvasLandingPageTemplate = await getPureFileData(
    files.fallbackCanvasLandingPageTemplate,
    urlType
  )

  const templatesNotFetched = getTemplatesThatWereNotFetched(iD.files)

  if (dataSpinner.isSpinning && !templatesNotFetched.length) {
    dataSpinner.succeed("Retrieved templates!")
  } else if (dataSpinner.isSpinning && templatesNotFetched.length) {
    dataSpinner.fail("Failed to retrieve some template files.")
    templatesNotFetched.forEach((template) => {
      console.log(`The ${template.displayName} template file could not be fetched.`)
    })
    await promptContinue("Do you want to continue without these templates? Some functionality will be limited.")
  }

  return iD
}

function getTemplatesThatWereNotFetched(
  files: Files
): (TemplateFile | PureTemplateFile)[] {
  const templates = [
    files.defaultLayout,
    files.rootReadme,
    files.videoHub,
    files.releaseNotes,
    files.instructorGuide,
    files.references,
    files.pklConfig,
    files.pklMicrolessons,
    files.originalAssetsReadmeTemplate
  ]

  return templates.filter((template) => !template.templateFileFetched)
}

export { collect, ResponseError }
