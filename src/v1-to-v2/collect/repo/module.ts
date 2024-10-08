// node
import path from "node:path"

// npm
import { camelCase } from "change-case"

// local
import {
  makeTitleCase,
  getFilePathsOfDirChildren,
  checkForTemplateAssetItems,
} from "./helpers.js"

// types
import type { Module } from "../../types.js"

// do the thing
async function getData(module: Module): Promise<Module> {
  try {
    const moduleDir = path.basename(path.resolve())
    const dirNameTitleCase = makeTitleCase(moduleDir)
    const canvasLandingPagesPaths = await getFilePathsOfDirChildren(
      "./canvas-landing-pages",
    )
    const clpFallbackExists = canvasLandingPagesPaths.some((path) =>
      path.includes("./canvas-landing-pages/fallback.md"),
    )

    const contains = await checkForTemplateAssetItems(".")

    return {
      ...module,
      headline: dirNameTitleCase,
      dirName: moduleDir,
      dirNameTitleCase: dirNameTitleCase,
      dirNameCamelCase: camelCase(moduleDir),
      meta: {
        ...module.meta,
        containsFallbackClp: clpFallbackExists,
        containsAssetsDir: contains.assets,
        createdAssetsDir: false,
        containsOriginalAssetsDir: contains.originalAssets,
        createdOriginalAssetsDir: false,
        containsOriginalAssetsReadme: contains.originalAssetsReadme,
        createdOriginalAssetsReadme: false,
      },
    }
  } catch (error) {
    return module
  }
}

export { getData }
