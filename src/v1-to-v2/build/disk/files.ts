// node
import { rm } from "node:fs/promises"

// types
import type {
  Data,
  Files,
  TemplateFile,
  TemplateFileWithHeading,
  TemplateFileWithLandingHeading,
  PklFile,
  ClpFile,
  MlFile,
} from "../../types.js"

// local
import { writeFileToDisk } from "./helpers.js"

// do the thing
async function build(iD: Data): Promise<Files> {
  const { files } = iD

  files.defaultLayout = await buildTemplateFile(files.defaultLayout)
  files.rootReadme = await buildTemplateFile(files.rootReadme)
  files.videoHub = await buildTemplateFile(files.videoHub)
  files.releaseNotes = await buildTemplateFile(files.releaseNotes)
  files.instructorGuide = await buildTemplateFile(files.instructorGuide)
  files.references = await buildTemplateFile(files.references)
  files.pklConfig = await buildTemplateFile(files.pklConfig)
  files.pklMicrolessons = await buildTemplateFile(files.pklMicrolessons)

  files.clps = await buildClps(files.clps)

  files.mls = await buildMls(files.mls)

  files.lvlUpMls = await buildLvlUpMls(files.lvlUpMls)

  return iD.files
}

async function buildTemplateFile<
  T extends
    | TemplateFile
    | TemplateFileWithHeading
    | TemplateFileWithLandingHeading
    | PklFile,
>(file: T): Promise<T> {
  // If we couldn't fetch the template file, we shouldn't do anything
  if (!file.templateFileFetched) return file

  if (file.shouldCreate && file.canMoveOrCreate) {
    file.didMoveOrCreate = await writeFileToDisk(
      file.desiredPath,
      file.newFileContent,
    )
  }

  if (file.isFound) {
    file.didUpdateInPlace = await writeFileToDisk(
      file.desiredPath,
      file.newFileContent,
    )
  }
  return file
}

async function buildClps(clps: ClpFile[]): Promise<ClpFile[]> {
  clps.forEach(async (clp) => {
    if (clp.shouldCreate && clp.canMoveOrCreate) {
      clp.didMoveOrCreate = await writeFileToDisk(
        clp.desiredPath,
        clp.newFileContent,
      )
    }

    if (clp.isFound) {
      clp.didUpdateInPlace = await writeFileToDisk(
        clp.desiredPath,
        clp.newFileContent,
      )
    }
  })

  return clps
}

async function buildMls(mls: MlFile[]): Promise<MlFile[]> {
  mls.forEach(async (ml) => {
    if (ml.isFound) {
      ml.didUpdateInPlace = await writeFileToDisk(
        ml.desiredPath,
        ml.newFileContent,
      )
    }
  })

  return mls
}

async function buildLvlUpMls(lvlUpMls: MlFile[]): Promise<MlFile[]> {
  lvlUpMls.forEach(async (lvlUpMl) => {
    if (lvlUpMl.isFound && lvlUpMl.shouldMove && lvlUpMl.canMoveOrCreate) {
      lvlUpMl.didMoveOrCreate = await writeFileToDisk(
        lvlUpMl.desiredPath,
        lvlUpMl.newFileContent,
      )
    }

    if (lvlUpMl.isFound && !lvlUpMl.canMoveOrCreate) {
      lvlUpMl.didUpdateInPlace = await writeFileToDisk(
        lvlUpMl.curPath,
        lvlUpMl.newFileContent,
      )
    }

    if (lvlUpMl.didMoveOrCreate) {
      await rm(lvlUpMl.curPath, { force: true })
    }
  })

  return lvlUpMls
}
export { build }
