// node
import { readdir, stat } from "fs/promises"
import path from "path"

// npm
import { titleCase } from "title-case"
import { camelCase } from "change-case"

// local
import { fixCommonWords } from "../helpers/index.js"

// types
import { Module, Dirs, Dir, File } from "../types.js"

// config
import { config } from "../config.js"

// do the thing
async function getData(dirs: Dirs): Promise<Dirs> {
  const {
    defaultLayout,
    canvasLandingPages,
    internalResources,
    references,
    levelUp,
  } = dirs
  const foundDirs = await getDirs()

  dirs.microlessons = getMicrolessonDirData(foundDirs)
  dirs.videoGuide.isFound = await findVideoGuide(foundDirs, dirs)
  dirs.levelUp.isFound = foundDirs.includes(levelUp.dirName)
  dirs.defaultLayout.isFound = foundDirs.includes(defaultLayout.dirName)
  dirs.canvasLandingPages.isFound = foundDirs.includes(
    canvasLandingPages.dirName
  )
  dirs.internalResources.isFound = foundDirs.includes(internalResources.dirName)
  dirs.references.isFound = foundDirs.includes(references.dirName)

  return dirs
}

async function getDirs() {
  const dirs = await readdir(".", { withFileTypes: true })
  return dirs.filter((dir) => dir.isDirectory()).map((dir) => dir.name)
}

function getMicrolessonDirData(foundDirs: string[]): Dir[] {
  const microlessonsDirs = filterStaticDirs(foundDirs)

  return microlessonsDirs.map((dir) => {
    const noDashName = titleCase(dir).replaceAll("-", " ")
    const fixedTitleCase = fixCommonWords(noDashName)

    return {
      type: "dir",
      isFound: true,
      path: `./${dir}`,
      dirName: dir,
      dirNameTitleCase: fixedTitleCase,
      dirNameCamelCase: camelCase(dir),
    }
  })
}

async function findVideoGuide(
  foundDirs: string[], 
  dirs: Dirs,
): Promise<boolean> {
  if (!foundDirs.includes(dirs.internalResources.dirName)) return false
  try {
    await stat(dirs.videoGuide.path)
    return true
  } catch (error) {
    return false
  }
}

function filterStaticDirs(dirList: string[]) {
  return dirList.filter((dir) => 
    !(config.staticDirs.includes(dir))
  )
}

async function getLevelUpMicrolessonDirData(files: File[]): Promise<Dir[]> {
  const foundDirs = await getDirs()

  return files.map(ml => {
    const fileName = path.basename(ml.path)
    const noDashName = titleCase(fileName).replaceAll("-", " ")
    const fixedTitleCase = fixCommonWords(noDashName)

    const isFound = foundDirs.includes(fileName)

    return {
      type: "dir",
      isFound: isFound,
      path: ml.path,
      dirName: fileName,
      dirNameTitleCase: fixedTitleCase,
      dirNameCamelCase: camelCase(fileName),
    }
  });
}

export { getData, getLevelUpMicrolessonDirData }
