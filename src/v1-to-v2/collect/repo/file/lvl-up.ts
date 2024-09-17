// node
import path from "node:path"

// local
import { getFilePathsOfDirChildren } from "../helpers.js"
import { getMlFilesData } from "./ml.js"
import { checkNeedToMakeLvlUpMlDirs, getLvlUpMlDirData } from "../dir/lvl-up.js"

// types
import type { Data, Files } from "../../../types.js"

// do the thing
async function getData(iD: Data): Promise<Files> {
  // If there is no level-up dir, we don't need to do any of this.
  if (!iD.dirs.lvlUp.isFound) {
    return iD.files
  }

  const lvlUpFilePaths = await getLvlUpFilePaths(iD)

  const validLvlUpMlFilePaths = lvlUpFilePaths.filter(
    (filepath) => path.extname(filepath) === ".md",
  )

  iD.files.invalidLvlUpFiles = lvlUpFilePaths.filter(
    (filepath) => path.extname(filepath) !== ".md",
  )

  const lvlUpFileNames = validLvlUpMlFilePaths.map(
    (lvlUpPath) => path.parse(lvlUpPath).name,
  )

  iD.files.lvlUpMls = await getMlFilesData(
    lvlUpFileNames,
    validLvlUpMlFilePaths,
    "lvl-up-ml",
  )

  // We only need to check to see if we can make microlesson dirs for Level
  // Up microlessons if the level-up dir holds more than just a README.md
  // file.
  if (checkNeedToMakeLvlUpMlDirs(iD, validLvlUpMlFilePaths)) {
    iD.dirs.lvlUpMls = await getLvlUpMlDirData(iD.files.lvlUpMls)
    iD.files = checkLvlUpMlMove(iD)
  }

  return iD.files
}

function checkLvlUpMlMove(iD: Data): Files {
  iD.files.lvlUpMls = iD.files.lvlUpMls.map((ml) => {
    const lvlUpDir = iD.dirs.lvlUpMls.find((dir) => dir.dirName === ml.fileName)
    return {
      ...ml,
      canMoveOrCreate: lvlUpDir?.canCreate === true ? true : false,
    }
  })

  return iD.files
}

async function getLvlUpFilePaths(iD: Data): Promise<string[]> {
  const lvlUpDirPath = iD.dirs.lvlUp.desiredPath
  const lvlUpFilePaths = await getFilePathsOfDirChildren(lvlUpDirPath)

  return lvlUpFilePaths
}

export { getData, getLvlUpFilePaths }
