// node
import { readFile } from "fs/promises"
import path from "node:path"

// local
import { getFilePathsOfDirChildren, makeTitleCase } from "../helpers.js"

// types
import { Data, Files, ClpFile } from "../../../types.js"

// do the thing
async function getData(iD: Data): Promise<Files> {
  const clpWillExist =
    iD.dirs.clps.isFound ||
    (iD.dirs.clps.canCreate && iD.dirs.clps.shouldCreate)

  if (!clpWillExist) return iD.files

  const canvasLandingPagesPaths = await getFilePathsOfDirChildren(
    "./canvas-landing-pages",
  )
  const canvasLandingPageNames = canvasLandingPagesPaths.map(
    (clpPath) => path.parse(clpPath).name,
  )

  iD.files.clps = await getClpFilesData(
    canvasLandingPageNames,
    canvasLandingPagesPaths,
  )

  return iD.files
}

async function getClpFilesData(
  itemNames: string[],
  filepaths: string[],
): Promise<ClpFile[]> {
  const filesContent = await Promise.allSettled(
    filepaths.map(async (filepath) => {
      return await readFile(filepath, "utf-8")
    }),
  )

  return filepaths.map((filepath, idx) => {
    const fileContent = filesContent[idx]!
    const foundWithoutError = fileContent.status === "fulfilled"

    const titleCaseName = makeTitleCase(itemNames[idx]!)

    return new ClpFile({
      fileName: path.parse(filepath).name,
      fileType: "",
      displayName: titleCaseName,
      curPath: filepath,
      curFileContent: foundWithoutError ? fileContent.value : "",
      desiredPath: filepath,
      isFound: foundWithoutError ? true : false,
    })
  })
}

export { getData }
