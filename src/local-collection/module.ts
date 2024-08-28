// node
import path from "path"

// npm
import { titleCase } from "title-case"
import { camelCase } from "change-case"

// local
import { fixCommonWords } from "../helpers/index.js"

// types
import { Module } from "../types.js"

function getData(module: Module): Module {
  const moduleDir = path.basename(path.resolve())
  const noDashName = titleCase(moduleDir).replaceAll("-", " ")
  const dirNameTitleCase = fixCommonWords(noDashName)

  return {
    ...module,
    dirName: moduleDir,
    dirNameTitleCase: dirNameTitleCase,
    dirNameCamelCase: camelCase(moduleDir),
  }
}

export { getData }
