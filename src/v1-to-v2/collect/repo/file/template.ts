// node
import { readFile } from "node:fs/promises"

// types
import type {
  Data,
  Files,
  TemplateFile,
  PklFile,
  TemplateFileWithHeading,
  TemplateFileWithLandingHeading,
} from "../../../types.js"

// do the thing
async function getData(iD: Data): Promise<Files> {
  const { files, dirs } = iD
  const internalResourcesWillExist =
    dirs.internalResources.isFound ||
    (dirs.internalResources.canCreate && dirs.internalResources.shouldCreate)
  const internalDataWillExist =
    dirs.internalData.isFound ||
    (dirs.internalData.canCreate && dirs.internalData.shouldCreate)
  const referencesWillExist =
    dirs.references.isFound ||
    (dirs.references.canCreate && dirs.references.shouldCreate)

  files.defaultLayout = await getTemplateFileData(files.defaultLayout)
  files.rootReadme = await getTemplateFileData(files.rootReadme)

  if (internalResourcesWillExist) {
    files.videoHub = await getTemplateFileData(files.videoHub)
    files.releaseNotes = await getTemplateFileData(files.releaseNotes)
    files.instructorGuide = await getTemplateFileData(files.instructorGuide)
  }

  if (internalResourcesWillExist && internalDataWillExist) {
    files.pklConfig = await getTemplateFileData(files.pklConfig)
    files.pklMicrolessons = await getTemplateFileData(files.pklMicrolessons)
  }

  if (referencesWillExist) {
    files.references = await getTemplateFileData(files.references)
  }

  return iD.files
}

async function getTemplateFileData<
  T extends
    | TemplateFile
    | PklFile
    | TemplateFileWithHeading
    | TemplateFileWithLandingHeading,
>(file: T): Promise<T> {
  try {
    const currentFile = await readFile(file.desiredPath, "utf-8")
    return {
      ...file,
      curPath: file.desiredPath,
      curFileContent: currentFile,
      isFound: true,
      ...((file.type === "TemplateFileWithHeading" ||
        file.type === "TemplateFileWithLandingHeading") && {
        canUpdateHeading: checkCanHeadingUpdate(currentFile),
      }),
    }
  } catch (error) {
    return {
      ...file,
      shouldCreate: true,
      canMoveOrCreate: true,
    }
  }
}

function checkCanHeadingUpdate(fileContent: string): boolean {
  const firstLine = fileContent.split("\n")[0]
  if (!firstLine) return false
  return firstLine.startsWith("# ![") && firstLine.endsWith(".png)")
}

export { getData }
