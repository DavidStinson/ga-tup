// local
import {
  buildSubHeading,
  removeHero,
} from "./helpers.js"

// types
import { Module, MlFile } from "../../types.js"

// do the thing
function build(mls: MlFile[], module: Module): MlFile[] {
  const migratedPages = migrateExistingPages(mls, module)

  return migratedPages
}

function migrateExistingPages(files: MlFile[], module: Module): MlFile[] {
  files.forEach((file, idx) => {
    // Don't take any action if there is no README.md file for a microlesson.
    if (file.type === "MlFile" && file.isFound) return

    files[idx] = migrateExistingPage(file, module)
  })
  return files
}

function migrateExistingPage(file: MlFile, module: Module): MlFile {
  const headline = buildSubHeading(module, file.titleCaseName)

  if (file.canUpdateHeading) {
    const oldFileNoHero = removeHero(file.curFileContent)
    file.newFileContent = headline + oldFileNoHero
    file.didUpdateHeading = true
  } else {
    file.newFileContent = headline + file.curFileContent
  }
  return file
}

export { build }
