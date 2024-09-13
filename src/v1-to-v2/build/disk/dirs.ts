// types
import { 
  Data, Dirs, TemplateDir, MlDir, LvlUpMlDir, PureTemplateFile, Meta
} from "../../types.js"

// local
import { writeDirToDisk, writeFileToDisk } from "./helpers.js"

// do the thing
async function build(iD: Data): Promise<Dirs> {
  iD.dirs.defaultLayout = await buildTemplateDir(iD.dirs.defaultLayout)
  iD.dirs.clps = await buildTemplateDir(iD.dirs.clps)
  iD.dirs.internalResources = await buildTemplateDir(iD.dirs.internalResources)
  iD.dirs.internalData = await buildTemplateDir(iD.dirs.internalData)
  iD.dirs.lvlUp = await buildTemplateDir(iD.dirs.lvlUp)
  iD.dirs.references = await buildTemplateDir(iD.dirs.references)
  iD.dirs.videoGuide = await buildTemplateDir(iD.dirs.videoGuide)

  iD.dirs.mls = await buildMlDirs(
    iD.dirs.mls, iD.files.originalAssetsReadmeTemplate
  )
  iD.dirs.lvlUpMls = await buildLvlUpMlDirs(
    iD.dirs.lvlUpMls, iD.files.originalAssetsReadmeTemplate
  )

  iD.module.meta = await buildAssetTemplateDirs(
    iD.module.meta, ".", iD.files.originalAssetsReadmeTemplate
  )

  return iD.dirs
}

async function buildTemplateDir(dir: TemplateDir): Promise<TemplateDir> {
  if (dir.shouldCreate && dir.canCreate) {
    dir.didCreate = await writeDirToDisk(dir.desiredPath)
  }
  return dir
}

async function buildMlDirs(
  dirs: MlDir[], originalAssetsReadmeTemplate: PureTemplateFile
): Promise<MlDir[]> {
  dirs.forEach(async (dir, idx) => {
    // Eject out of this if we don't have a README.md file, we can't be sure of
    // what this directory actually is, so we don't want to make any changes.
    if (!dir.containsReadme) return

    dirs[idx] = await buildAssetTemplateDirs(
      dir, dir.curPath, originalAssetsReadmeTemplate
    )
  })

  return dirs
}

async function buildAssetTemplateDirs<T extends MlDir | LvlUpMlDir | Meta>(
  item: T, dirPath: string, originalAssetsReadmeTemplate: PureTemplateFile
): Promise<T> {
  if (!item.containsAssetsDir) {
    item.createdAssetsDir = await writeDirToDisk(`${dirPath}/assets`)
  }
  if (!item.containsOriginalAssetsDir) {
    item.createdOriginalAssetsDir = await writeDirToDisk(
      `${dirPath}/assets/originals`
    )
  }
  if (!item.containsOriginalAssetsReadme) {
    item.createdOriginalAssetsReadme = await writeFileToDisk(
      `${dirPath}/assets/originals/README.md`,
      originalAssetsReadmeTemplate.templateFile
    )
  }
  return item
}

async function buildLvlUpMlDirs(
  dirs: LvlUpMlDir[], originalAssetsReadmeTemplate: PureTemplateFile
): Promise<LvlUpMlDir[]> {
  dirs.forEach(async (dir, idx) => {
    // Eject out of this if we can't create the directory.
    if (!dir.shouldCreate || !dir.canCreate) return

    dirs[idx] = await buildLvlUpMlDir(dir, originalAssetsReadmeTemplate)
  })

  return dirs
}

async function buildLvlUpMlDir(
  dir: LvlUpMlDir, originalAssetsReadmeTemplate: PureTemplateFile
): Promise<LvlUpMlDir> {
  dir.didCreate = await writeDirToDisk(dir.desiredPath)

  if (dir.didCreate) {
    dir = await buildAssetTemplateDirs(
      dir, dir.desiredPath, originalAssetsReadmeTemplate
    )
  }
  return dir
}

export { build }
