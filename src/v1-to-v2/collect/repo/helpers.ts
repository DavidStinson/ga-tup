// node
import { readdir } from "node:fs/promises"
import { access, constants } from "fs/promises"

// npm
import { titleCase } from "title-case"

// types
interface Contains {
  assets: boolean,
  originalAssets: boolean,
  originalAssetsReadme: boolean,
}

// config
import { config } from "../../config.js"

// do the thing
function makeTitleCase(str: string): string {
  const dictionary = config.commonWords
  let noDashName = titleCase(str).replaceAll("-", " ")

  Object.keys(dictionary).forEach((word) => {
    noDashName = noDashName.replaceAll(word, dictionary[word])
  })
  
  return noDashName
}

async function getDirs() {
  const dirs = await readdir(".", { withFileTypes: true })
  return dirs.filter((dir) => dir.isDirectory()).map((dir) => dir.name)
}

async function getFilePathsOfDirChildren(dirPath: string): Promise<string[]> {
  return (await readdir(dirPath, { withFileTypes: true }))
    .filter((item) => item.isFile())
    .map((item) => `${dirPath}/${item.name}`)
}

async function getFilesThatExist(paths: string[]): Promise<string[]> {
  const results = await Promise.all(paths.map(async (path) => {
    try {
      await access(path, constants.F_OK)
      return true
    } catch (error) {
      return false
    }
  }))

  return paths.filter((asset, idx) => results[idx])
}

async function checkForTemplateAssetItems(dirName: string): Promise<Contains> {
  dirName = dirName === "." ? "." : `./${dirName}`
  try {
    const foundAssets = await getFilesThatExist([
      `${dirName}/assets`,
      `${dirName}/assets/originals`,
      `${dirName}/assets/originals/README.md`,
    ])
    const containsAssets = foundAssets.includes(`${dirName}/assets`)
    const containsOriginalAssets = 
      foundAssets.includes(`${dirName}/assets/originals`)
    const containsOriginalAssetsReadme = 
      foundAssets.includes(`${dirName}/assets/originals/README.md`)
    return {
      assets: containsAssets,
      originalAssets: containsOriginalAssets,
      originalAssetsReadme: containsOriginalAssetsReadme,
    }
  } catch (error) {
    return {
      assets: false,
      originalAssets: false,
      originalAssetsReadme: false,
    }
  }
}

export { 
  makeTitleCase,
  getDirs,
  getFilePathsOfDirChildren,
  getFilesThatExist,
  checkForTemplateAssetItems,
}
