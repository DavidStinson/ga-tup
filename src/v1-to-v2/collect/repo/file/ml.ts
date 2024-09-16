// node
import { readFile, readdir } from "node:fs/promises"
import path from "node:path"

// npm
import { camelCase } from "change-case"

// local
import { makeTitleCase } from "../helpers.js"

// types
import { Data, Files, MlDir, MlFile } from "../../../types.js"

// do the thing
async function getData(iD: Data): Promise<Files> {
  if (!iD.dirs.mls.length) return iD.files

  const mlPagesPaths = getMicrolessonReadmePaths(iD.dirs.mls)
  const mlDirNames = iD.dirs.mls.map((ml) => ml.dirName)
  iD.files.invalidMlFiles = getInvalidMlFiles(iD, mlDirNames)
  iD.files.mls = await getMlFilesData(mlDirNames, mlPagesPaths, "ml")

  return iD.files
}

function getMicrolessonReadmePaths(mls: MlDir[]): string[] {
  return mls.map((ml) => `./${ml.dirName}/README.md`)
}

function getInvalidMlFiles(iD: Data, mlDirNames: string[]): string[] {
  const mlDirPaths = mlDirNames.map((dir) => `./${dir}`)
  mlDirPaths.forEach(async (mlDirPath) => {
    ;(await readdir(mlDirPath, { withFileTypes: true }))
      .filter((item) => item.name !== "README.md" && item.name !== "assets")
      .map((item) => `${mlDirPath}/${item.name}`)
      .forEach((item) => {
        iD.files.invalidMlFiles.push(item)
      })
  })
  return iD.files.invalidMlFiles
}

async function getMlFilesData(
  itemNames: string[],
  filepaths: string[],
  type: "ml" | "lvl-up-ml",
): Promise<MlFile[]> {
  const filesContent = await Promise.allSettled(
    filepaths.map(async (filepath) => {
      return await readFile(filepath, "utf-8")
    }),
  )

  return filepaths.map((filepath, idx) => {
    const fileContent = filesContent[idx]!
    const foundWithoutError = fileContent.status === "fulfilled"

    const titleCaseName = makeTitleCase(itemNames[idx]!)

    const desiredPath =
      type === "lvl-up-ml" ? `./${itemNames[idx]}/README.md` : filepath

    return new MlFile({
      fileName: path.parse(filepath).name,
      fileType: path.extname(filepath),
      displayName: titleCaseName,
      curPath: filepath,
      curFileContent: foundWithoutError ? fileContent.value : "",
      desiredPath: desiredPath,
      shouldMove: type === "lvl-up-ml",
      isFound: foundWithoutError,
      isLvlUp: type === "lvl-up-ml",
      kebabName: itemNames[idx]!,
      titleCaseName: titleCaseName,
      camelCaseName: camelCase(itemNames[idx]!),
    })
  })
}

export { getData, getMlFilesData }
