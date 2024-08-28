// node
import { readdir } from "fs/promises"

// local
import { getData as getFileData } from "./file-details.js"
import { getData as getFilesData } from "./files-details.js"
import { getData as getIfFilesExist } from "./files-exists.js"
import { getData as getDirs, getLevelUpMicrolessonDirData } from "./dirs.js"
import { getData as getModule } from "./module.js"

// types
import { Data, Dir } from "../types.js"

// config
import { config } from "../config.js"
const { path } = config

// do the thing
async function collect(iD: Data): Promise<Data> {
  iD.files.rootReadme = await getFileData(iD.files.rootReadme)
  iD.files.defaultLayout = await getFileData(iD.files.defaultLayout)
  iD.assets.rootAssets = await getIfFilesExist(path.rootAssets)

  iD.module = getModule(iD.module)
  iD.dirs = await getDirs(iD.dirs)

  const mlAssetCandidates = getMicrolessonAssetPaths(iD.dirs.microlessons)
  iD.assets.microlessonAssets = await getIfFilesExist(mlAssetCandidates)

  if (iD.dirs.internalResources.isFound) {
    iD.files.videoHub = await getFileData(iD.files.videoHub)
    iD.files.releaseNotes = await getFileData(iD.files.releaseNotes)
    iD.files.instructorGuide = await getFileData(iD.files.instructorGuide)
    iD.assets.miscAssets.push(...await getIfFilesExist(path.internalResourcesAssets))
  }

  if (iD.dirs.references.isFound) {
    iD.files.references = await getFileData(iD.files.references)
    iD.assets.miscAssets.push(...await getIfFilesExist(path.referencesAssets))
  }

  if (iD.dirs.canvasLandingPages.isFound) {
    const canvasLandingPagesPaths = await getFilePathsOfDirChildren(
      "./canvas-landing-pages"
    )
    iD.files.canvasLandingPages = await getFilesData(canvasLandingPagesPaths)
  }

  if (iD.dirs.microlessons.length) {
    const mlPagesPaths = getMicrolessonReadmePaths(iD.dirs.microlessons)
    iD.files.microlessons = await getFilesData(mlPagesPaths)
  }

  if (iD.dirs.levelUp.isFound) {
    const levelUpFilesPaths = await getFilePathsOfDirChildren("./level-up")
    iD.files.levelUpMicrolessons = await getFilesData(levelUpFilesPaths)
    iD.dirs.levelUpMicrolessons = await getLevelUpMicrolessonDirData(
      iD.files.levelUpMicrolessons,
    )
  }

  return iD
}

function getMicrolessonReadmePaths(mls: Dir[]): string[] {
  return mls.map(ml => (`./${ml.dirName}/README.md`))  
}

function getMicrolessonAssetPaths(mls: Dir[]): string[] {
  const mlAssetCandidates: string[] = []

  mls.forEach(ml => {
    mlAssetCandidates.push(`./${ml.dirName}/assets/hero.png`)
    mlAssetCandidates.push(`./${ml.dirName}/assets/originals/hero.eps`)
  });

  return mlAssetCandidates
}

async function getFilePathsOfDirChildren(dirPath: string): Promise<string[]> {
  return (await readdir(dirPath, {withFileTypes: true}))
    .filter(item => !item.isDirectory())
    .map(item => (`${dirPath}/${item.name}`))
}

export {
  collect
}
